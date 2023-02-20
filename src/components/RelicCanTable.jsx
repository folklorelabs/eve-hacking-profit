import * as React from 'react';
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
import { canProps } from '../propTypes/can';
import { canMetaProps } from '../propTypes/canMeta';
import Can from './Can';
import {
  useRelicSitesContext,
  getFactionCanAvg,
  getFactionCanMax,
  getFactionRelicItems,
} from '../contexts/RelicSites';

function Row({ can, canMeta }) {
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
              <Can can={can} canMeta={canMeta} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  can: canProps.isRequired,
  canMeta: canMetaProps.isRequired,
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
            <Row
              key={can.id}
              can={can}
              canMeta={relicSitesState.cans[can.type]}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
