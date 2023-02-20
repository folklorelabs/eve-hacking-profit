import React from 'react';
import PropTypes from 'prop-types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
} from './FactionSite.styles';
import {
  getFactionCanAvg,
  getFactionCanMax,
  useProfitContext,
} from '../contexts/Profit';

function FactionSite({
  factionId,
  siteId,
}) {
  const { profitState } = useProfitContext();
  const factionMeta = React.useMemo(() => profitState.factions
    .find((faction) => faction.id === factionId), [factionId, profitState]);
  const siteMeta = React.useMemo(() => profitState.sites
    .find((site) => site.id === siteId), [siteId, profitState]);
  const siteCans = React.useMemo(() => siteMeta.cans
    .map((c) => ({
      ...c,
      ...profitState.cans.find((sc) => sc.id === c.id),
      value: getFactionCanAvg(profitState, factionId, c.id),
      max: getFactionCanMax(profitState, factionId, c.id),
    })), [
    factionId,
    siteMeta.cans,
    profitState,
  ]);
  return (
    <Container className="FactionSite">
      <Typography variant="h6" gutterBottom component="div">
        {siteMeta.category === 'relic' ? 'Ruined' : 'Central'}
        {' '}
        {factionMeta.name}
        {' '}
        {siteMeta.name}
      </Typography>
      <Typography>
        Difficulty:
        {' '}
        {siteMeta.difficulty}
      </Typography>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell>Qty</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Average Can Value (ISK)</TableCell>
            <TableCell align="right">Max Can Value (ISK)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {siteCans.sort((a, b) => b.value - a.value).map((can) => (
            <TableRow key={can.id}>
              <TableCell align="center">
                {can.qty.toLocaleString()}
              </TableCell>
              <TableCell component="th" scope="row">
                <Link component={RouterLink} to="/cans" state={{ canFaction: factionId, canType: can.id }}>
                  {factionMeta.name}
                  {' '}
                  {can.name}
                </Link>
              </TableCell>
              <TableCell align="right">
                {Math.round(can.value).toLocaleString()}
              </TableCell>
              <TableCell align="right">
                {Math.round(can.max).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

FactionSite.defaultProps = {

};

FactionSite.propTypes = {
  factionId: PropTypes.oneOf([
    'angel-cartel',
    'blood-raiders',
    'guristas',
    'sanshas-nation',
    'serpentis',
  ]).isRequired,
  siteId: PropTypes.string.isRequired,
};

export default FactionSite;
