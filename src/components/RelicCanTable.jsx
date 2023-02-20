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
import { canProps } from '../propTypes/can';
import Can from './Can';
import {
  useRelicSitesContext,
  getFactionCanAvg,
  getFactionCanMax,
  getFactionRelicItems,
} from '../contexts/RelicSites';

function Row({ can, initialOpen }) {
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
          Relic
        </TableCell>
        <TableCell component="th" scope="row">
          {can.faction}
        </TableCell>
        <TableCell component="th" scope="row">
          {can.type}
        </TableCell>
        <TableCell align="right">{Math.round(can.value).toLocaleString()}</TableCell>
        <TableCell align="right">{Math.round(can.max).toLocaleString()}</TableCell>
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
              <Can can={can} />
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
  can: canProps.isRequired,
  initialOpen: PropTypes.bool,
};

export default function RelicCanTable() {
  const { state } = useLocation();
  const [dirty, setDirty] = React.useState(false);
  const [canFactionFilters, setCanFactionFilters] = React
    .useState(() => (state.canFaction ? [state.canFaction] : []));
  const [canTypeFilters, setCanTypeFilters] = React
    .useState(() => (state.canType ? [state.canType] : []));
  const { relicSitesState } = useRelicSitesContext();
  const allCans = React.useMemo(() => {
    const cans = [];
    Object.keys(relicSitesState.itemsByFaction).forEach((factionName) => {
      Object.keys(relicSitesState.cans).forEach((canType) => {
        const can = {
          id: `${factionName}_${canType}`,
          type: canType,
          faction: factionName,
          lootTable: getFactionRelicItems(relicSitesState, factionName),
          value: getFactionCanAvg(relicSitesState, factionName, canType),
          max: getFactionCanMax(relicSitesState, factionName, canType),
          lootTiers: Object.keys(relicSitesState.cans[canType]).map((lootTierId) => ({
            ...relicSitesState.cans[canType][lootTierId],
            id: lootTierId,
          })),
        };
        cans.push(can);
      });
    });
    return cans;
  }, [relicSitesState]);
  const factions = React.useMemo(
    () => [...new Set(allCans.map((can) => can.faction))],
    [allCans],
  );
  const canTypes = React.useMemo(
    () => [...new Set(allCans.map((can) => can.type))],
    [allCans],
  );
  const filteredCans = React.useMemo(() => allCans
    .filter((can) => !canFactionFilters.length || canFactionFilters.includes(can.faction))
    .filter((can) => !canTypeFilters.length || canTypeFilters.includes(can.type))
    .sort((a, b) => b.value - a.value), [allCans, canFactionFilters, canTypeFilters]);
  const filteredAvg = React.useMemo(() => {
    const total = filteredCans.map((can) => can.value).reduce((sum, val) => sum + val, 0);
    return total / filteredCans.length;
  }, [filteredCans]);
  const filteredMax = React.useMemo(
    () => Math.max(...filteredCans.map((can) => can.max)),
    [filteredCans],
  );
  return (
    <Box>
      <Box sx={{ display: 'flex', m: 3 }}>
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
            aria-label="table filtering"
          >
            {factions.map((faction) => (
              <ToggleButton key={faction} value={faction} aria-label={faction}>
                {faction}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Box>
          Site Type:
          {' '}
          <ToggleButtonGroup
            size="small"
            value={canTypeFilters}
            onChange={(e, newFilters) => {
              setCanTypeFilters(newFilters);
              setDirty(true);
            }}
            aria-label="table filtering"
          >
            {canTypes.map((siteType) => (
              <ToggleButton key={siteType} value={siteType} aria-label={siteType}>
                {siteType}
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
              <TableCell>Faction</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Average&nbsp;Value&nbsp;(ISK)</TableCell>
              <TableCell align="right">Max&nbsp;Value&nbsp;(ISK)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCans.sort((a, b) => b.value - a.value).map((can) => (
              <Row
                key={can.id}
                can={can}
                initialOpen={!dirty
                  && can.faction === state.canFaction && can.type === state.canType}
              />
            ))}
            <TableRow>
              <TableCell />
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
