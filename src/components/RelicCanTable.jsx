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
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { itemProps } from '../propTypes/item';
import Can from './Can';
import {
  useRelicSitesContext,
  getFactionCanAvg,
  getFactionCanMax,
  getFactionRelicItems,
} from '../contexts/RelicSites';

function Row({ can }) {
  const [open, setOpen] = React.useState(false);
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

Row.propTypes = {
  can: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    faction: PropTypes.string,
    value: PropTypes.number,
    max: PropTypes.number,
    lootTable: PropTypes.arrayOf(itemProps),
    canMeta: PropTypes.shape({
      probability: PropTypes.number,
      qtyCeiling: PropTypes.number,
      qtyFloor: PropTypes.number,
    }),
  }).isRequired,
};

export default function RelicCanTable() {
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
          canMeta: relicSitesState.cans[canType],
        };
        cans.push(can);
      });
    });
    return cans;
  }, [relicSitesState]);
  return (
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
          {allCans.sort((a, b) => b.value - a.value).map((can) => (
            <Row key={can.id} can={can} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
