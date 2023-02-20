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
  ToggleButtonGroup,
  ToggleButton,
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
  const [factionFilters, setFactionFilters] = React.useState(() => []);
  const [siteFilters, setSiteFilters] = React.useState(() => []);
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
  const factions = React.useMemo(
    () => [...new Set(allSites.map((site) => site.faction))],
    [allSites],
  );
  const siteTypes = React.useMemo(
    () => [...new Set(allSites.map((site) => site.siteType))],
    [allSites],
  );
  const filteredSites = React.useMemo(() => allSites
    .filter((site) => !factionFilters.length || factionFilters.includes(site.faction))
    .filter((site) => !siteFilters.length || siteFilters.includes(site.siteType))
    .sort((a, b) => b.value - a.value), [allSites, factionFilters, siteFilters]);
  const filteredAvg = React.useMemo(() => {
    const total = filteredSites.map((site) => site.value).reduce((sum, val) => sum + val, 0);
    return total / filteredSites.length;
  }, [filteredSites]);
  const filteredMax = React.useMemo(
    () => Math.max(...filteredSites.map((site) => site.max)),
    [filteredSites],
  );
  return (
    <Box>
      <Box sx={{ display: 'flex', m: 3 }}>
        <Box sx={{ mr: 2 }}>
          Faction:
          {' '}
          <ToggleButtonGroup
            size="small"
            value={factionFilters}
            onChange={(e, newFilters) => {
              setFactionFilters(newFilters);
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
            value={siteFilters}
            onChange={(e, newFilters) => {
              setSiteFilters(newFilters);
            }}
            aria-label="table filtering"
          >
            {siteTypes.map((siteType) => (
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
              <TableCell>Site Type</TableCell>
              <TableCell align="right">Average&nbsp;Value&nbsp;(ISK)</TableCell>
              <TableCell align="right">Max&nbsp;Value&nbsp;(ISK)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSites.map((site) => (
              <Row key={site.id} site={site} />
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
