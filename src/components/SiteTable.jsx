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
import {
  useProfitContext,
  getFactionCanAvg,
  getFactionCanMax,
} from '../contexts/Profit';
import FactionSite from './FactionSite';

function Row({
  factionId,
  siteId,
  categoryName,
  siteName,
  siteValue,
  siteMax,

}) {
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
          {categoryName}
        </TableCell>
        <TableCell component="th" scope="row">
          {siteName}
        </TableCell>
        <TableCell align="right">{Math.round(siteValue).toLocaleString()}</TableCell>
        <TableCell align="right">{Math.round(siteMax).toLocaleString()}</TableCell>
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
              <FactionSite factionId={factionId} siteId={siteId} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  factionId: PropTypes.string.isRequired,
  siteId: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  siteValue: PropTypes.number.isRequired,
  siteMax: PropTypes.number.isRequired,
};

export default function SiteTable() {
  const [categoryFilters, setCategoryFilters] = React.useState(() => []);
  const [factionFilters, setFactionFilters] = React.useState(() => []);
  const [siteFilters, setSiteFilters] = React.useState(() => []);
  const { profitState } = useProfitContext();
  const factionSites = React.useMemo(() => {
    const sites = [];
    profitState.factions.forEach((faction) => {
      profitState.sites.forEach((site) => {
        const factionCans = site.cans.map((fc) => ({
          id: `${faction.id}_${site.id}_${fc.id}`,
          value: getFactionCanAvg(profitState, faction.id, fc.id),
          max: getFactionCanMax(profitState, faction.id, fc.id),
          qty: fc.qty,
        }));
        sites.push({
          id: `${faction.id}_${site.id}`,
          name: `${site.category === 'relic' ? 'Ruined' : 'Central'} ${faction.name} ${site.name}`,
          faction,
          site,
          value: factionCans.reduce((all, can) => all + (can.qty * can.value), 0),
          max: factionCans.reduce((all, can) => all + (can.qty * can.max), 0),
          category: {
            id: site.category,
            name: `${site.category.charAt(0).toUpperCase()}${site.category.slice(1)}`,
          },
        });
      });
    });
    return sites;
  }, [profitState]);
  const siteCategories = React.useMemo(
    () => [...new Set(factionSites.map((fc) => fc.category.id))],
    [factionSites],
  );
  const factions = React.useMemo(
    () => [...new Set(factionSites.map((fs) => fs.faction))],
    [factionSites],
  );
  const siteTypes = React.useMemo(
    () => [...new Set(factionSites.map((fs) => fs.site))],
    [factionSites],
  );
  const filteredSites = React.useMemo(
    () => factionSites
      .filter((fs) => !categoryFilters.length
        || categoryFilters.includes(fs.category.id))
      .filter((fs) => !factionFilters.length || factionFilters.includes(fs.faction.id))
      .filter((fs) => !siteFilters.length || siteFilters.includes(fs.site.id))
      .sort((a, b) => b.value - a.value),
    [factionSites, factionFilters, siteFilters, categoryFilters],
  );
  const filteredAvg = React.useMemo(() => {
    const total = filteredSites.map((fs) => fs.value).reduce((sum, val) => sum + val, 0);
    return total / filteredSites.length;
  }, [filteredSites]);
  const filteredMax = React.useMemo(
    () => Math.max(...filteredSites.map((fs) => fs.max)),
    [filteredSites],
  );
  return (
    <Box>
      <Box sx={{ display: 'flex', m: 3 }}>
        <Box sx={{ mr: 2 }}>
          Type:
          {' '}
          <ToggleButtonGroup
            size="small"
            value={categoryFilters}
            onChange={(e, newFilters) => {
              setCategoryFilters(newFilters);
            }}
            aria-label="category filtering"
          >
            {siteCategories.map((category) => (
              <ToggleButton key={category.id} value={category.id} aria-label={category.id}>
                {category.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
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
              <ToggleButton key={faction.id} value={faction.id} aria-label={faction.id}>
                {faction.name}
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
            {siteTypes.map((site) => (
              <ToggleButton key={site.id} value={site.id} aria-label={site.id}>
                {site.name}
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
            {filteredSites.map((fs) => (
              <Row
                key={fs.id}
                factionId={fs.faction.id}
                siteId={fs.site.id}
                categoryName={fs.category.name}
                siteName={fs.name}
                siteValue={fs.value}
                siteMax={fs.max}
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
