import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  // Box,
  Typography,
} from '@mui/material';
// import percentLabel from '../utils/percentLabel';

import {
  Container,
} from './Site.styles';
// import LootTable from './LootTable';
// import { TypeEmphasis } from './TypeEmphasis';
import { siteProps } from '../propTypes/site';

function Site({
  site,
}) {
  return (
    <Container className="Site">
      <Typography variant="h6" gutterBottom component="div">
        Ruined
        {' '}
        {site.faction}
        {' '}
        {site.siteType}
      </Typography>
      <Typography>
        Difficulty:
        {' '}
        {site.difficulty}
      </Typography>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Average Can Value (ISK)</TableCell>
            <TableCell align="right">Max Can Value (ISK)</TableCell>
            <TableCell align="right">Cans / Site</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {site.cans.sort((a, b) => b.value - a.value).map((can) => (
            <TableRow key={can.id}>
              <TableCell component="th" scope="row">
                {can.type}
              </TableCell>
              <TableCell align="right">
                {Math.round(can.value).toLocaleString()}
              </TableCell>
              <TableCell align="right">
                {Math.round(can.max).toLocaleString()}
              </TableCell>
              <TableCell align="right">
                {can.qty.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

Site.defaultProps = {

};

Site.propTypes = {
  site: siteProps.isRequired,
};

export default Site;
