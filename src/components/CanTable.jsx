import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Collapse,
  IconButton,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useLocation } from 'react-router-dom';
import FactionCan from './FactionCan';
import {
  useProfitContext,
  getFactionCanAvg,
  getFactionCanMax,
} from '../contexts/Profit';

function Row({
  type,
  name,
  avgValue,
  maxValue,
  factionId,
  canId,
  initialOpen,
}) {
  const [open, setOpen] = React.useState(initialOpen);
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {type}
        </TableCell>
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell align="right">{Math.round(avgValue).toLocaleString()}</TableCell>
        <TableCell align="right">{Math.round(maxValue).toLocaleString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{
              display: 'flex',
              py: 2,
              px: 1,
              pb: 5,
            }}
            >
              <FactionCan factionId={factionId} canId={canId} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.defaultProps = {
  initialOpen: false,
};

Row.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avgValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  factionId: PropTypes.string.isRequired,
  canId: PropTypes.string.isRequired,
  initialOpen: PropTypes.bool,
};

export default function CanTable() {
  const { state } = useLocation();
  const [dirty, setDirty] = React.useState(false);
  const [canCategoryFilters, setCanCategoryFilters] = React
    .useState(() => (state && state.canCategory ? [state.canCategory] : []));
  const [canFactionFilters, setCanFactionFilters] = React
    .useState(() => (state && state.canFaction ? [state.canFaction] : []));
  const [canTypeFilters, setCanTypeFilters] = React
    .useState(() => (state && state.canType ? [state.canType] : []));
  const { profitState } = useProfitContext();
  const factionCans = React.useMemo(() => {
    const cans = [];
    profitState.factions.forEach((faction) => {
      profitState.cans.forEach((can) => {
        const categoryId = can.contents[0].type.split('-')[0];
        cans.push({
          id: `${faction.id}_${can.id}`,
          name: `${faction.name} ${can.name}`,
          faction,
          can,
          value: getFactionCanAvg(profitState, faction.id, can.id),
          max: getFactionCanMax(profitState, faction.id, can.id),
          category: {
            id: categoryId,
            name: `${categoryId.charAt(0).toUpperCase()}${categoryId.slice(1)}`,
          },
        });
      });
    });
    return cans;
  }, [profitState]);
  const canCategories = React.useMemo(
    () => [...new Set(factionCans.map((fc) => fc.category.id))],
    [factionCans],
  );
  const canTypes = React.useMemo(
    () => [...new Set(factionCans.map((fc) => fc.can))],
    [factionCans],
  );
  const filteredFactionCans = React.useMemo(
    () => factionCans
      .filter((fc) => !canCategoryFilters.length || canCategoryFilters.includes(fc.category.id))
      .filter((fc) => !canFactionFilters.length || canFactionFilters.includes(fc.faction.id))
      .filter((fc) => !canTypeFilters.length || canTypeFilters.includes(fc.can.id))
      .sort((a, b) => b.value - a.value),
    [factionCans, canFactionFilters, canTypeFilters, canCategoryFilters],
  );
  const filteredAvg = React.useMemo(() => {
    const total = filteredFactionCans.map((fc) => fc.value).reduce((sum, val) => sum + val, 0);
    return total / filteredFactionCans.length;
  }, [filteredFactionCans]);
  const filteredMax = React.useMemo(
    () => Math.max(...filteredFactionCans.map((fc) => fc.max)),
    [filteredFactionCans],
  );
  return (
    <Box>
      <Box sx={{ display: 'flex', m: 3 }}>
        {canCategories.length > 1 ? (
          <Box sx={{ mr: 2 }}>
            Type:
            {' '}
            <ToggleButtonGroup
              size="small"
              value={canCategoryFilters}
              onChange={(e, newFilters) => {
                setCanCategoryFilters(newFilters);
                setDirty(true);
              }}
              aria-label="category filtering"
            >
              {canCategories.map((categoryId) => (
                <ToggleButton key={categoryId} value={categoryId} aria-label={categoryId}>
                  {categoryId}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        ) : ''}
        <Box sx={{ mr: 2 }}>
          Faction:
          {' '}
          <ToggleButtonGroup
            size="small"
            value={canFactionFilters}
            onChange={(e, newFilters) => {
              setCanFactionFilters(newFilters);
              setDirty(true);
            }}
            aria-label="faction filtering"
          >
            {profitState.factions.map((faction) => (
              <ToggleButton key={faction.id} value={faction.id} aria-label={faction.name}>
                {faction.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Box>
          Site:
          {' '}
          <ToggleButtonGroup
            size="small"
            value={canTypeFilters}
            onChange={(e, newFilters) => {
              setCanTypeFilters(newFilters);
              setDirty(true);
            }}
            aria-label="site filtering"
          >
            {canTypes.map((can) => (
              <ToggleButton key={can.id} value={can.id} aria-label={can.name}>
                {can.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="relic site breakdown">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Average&nbsp;Value&nbsp;(ISK)</TableCell>
              <TableCell align="right">Max&nbsp;Value&nbsp;(ISK)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFactionCans.map((fc) => (
              <Row
                key={fc.id}
                type={fc.category.name}
                name={fc.name}
                avgValue={fc.value}
                maxValue={fc.max}
                factionId={fc.faction.id}
                canId={fc.can.id}
                initialOpen={state && !dirty
                  && fc.faction.id === state.canFaction && fc.can.id === state.canType}
              />
            ))}
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell align="right">{Math.round(filteredAvg).toLocaleString()}</TableCell>
              <TableCell align="right">{Math.round(filteredMax).toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
