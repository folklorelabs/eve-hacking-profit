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
import { siteProps } from '../propTypes/site';
import {
  useRelicSitesContext,
  getFactionCanAvg,
  getFactionCanMax,
  getFactionRelicItems,
} from '../contexts/RelicSites';
import Site from './Site';

function Row({ site }) {
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
          {site.faction}
        </TableCell>
        <TableCell component="th" scope="row">
          {site.siteType}
        </TableCell>
        <TableCell align="right">{Math.round(site.value).toLocaleString()}</TableCell>
        <TableCell align="right">{Math.round(site.max).toLocaleString()}</TableCell>
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
              <Site site={site} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  site: siteProps.isRequired,
};

export default function RelicSiteTable() {
  const { relicSitesState } = useRelicSitesContext();
  const allSites = React.useMemo(() => {
    const sites = [];
    Object.keys(relicSitesState.itemsByFaction).forEach((factionName) => {
      Object.keys(relicSitesState.sites).forEach((siteType) => {
        const site = relicSitesState.sites[siteType];
        const siteCans = Object.keys(site.cans).map((canType) => ({
          id: `${factionName}_${siteType}_${canType}`,
          faction: factionName,
          type: canType,
          value: getFactionCanAvg(relicSitesState, factionName, canType),
          max: getFactionCanMax(relicSitesState, factionName, canType),
          qty: site.cans[canType],
        }));
        sites.push({
          id: `Ruined ${factionName} ${siteType}`,
          faction: factionName,
          siteType,
          difficulty: site.difficulty,
          lootTable: getFactionRelicItems(relicSitesState, factionName),
          cans: siteCans,
          value: siteCans.reduce((all, can) => all + (can.qty * can.value), 0),
          max: siteCans.reduce((all, can) => all + (can.qty * can.max), 0),
        });
      });
    });
    return sites;
  }, [relicSitesState]);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="relic site breakdown">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Type</TableCell>
            <TableCell>Faction</TableCell>
            <TableCell>Site Type</TableCell>
            <TableCell align="right">Average&nbsp;Value&nbsp;(ISK)</TableCell>
            <TableCell align="right">Max&nbsp;Value&nbsp;(ISK)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allSites.sort((a, b) => b.value - a.value).map((site) => (
            <Row key={site.id} site={site} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
