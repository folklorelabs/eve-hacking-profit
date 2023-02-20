import React from 'react';

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
} from './Site.styles';
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
            <TableCell>Qty</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Average Can Value (ISK)</TableCell>
            <TableCell align="right">Max Can Value (ISK)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {site.cans.sort((a, b) => b.value - a.value).map((can) => (
            <TableRow key={can.id}>
              <TableCell align="center">
                {can.qty.toLocaleString()}
              </TableCell>
              <TableCell component="th" scope="row">
                <Link component={RouterLink} to="/cans" state={{ canFaction: can.faction, canType: can.type }}>
                  {can.faction}
                  {' '}
                  {can.type}
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

Site.defaultProps = {

};

Site.propTypes = {
  site: siteProps.isRequired,
};

export default Site;
