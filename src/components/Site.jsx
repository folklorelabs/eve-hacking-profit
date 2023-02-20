import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Typography,
} from '@mui/material';
import { itemProps } from '../propTypes/item';
import percentLabel from '../utils/percentLabel';

import {
  Container,
} from './Site.styles';
import LootTable from './LootTable';
import { TypeEmphasis } from './TypeEmphasis';

function Site({
  can,
  size,
}) {
  return (
    <Container className="Site" size={size}>
      {can.canMeta[1].probability ? (
        <Box sx={{ pr: 8 }}>
          <Typography variant="h6" gutterBottom component="div">
            T1 Salvage
          </Typography>
          <Typography sx={{ maxWidth: 260 }}>
            <TypeEmphasis>
              {percentLabel(can.canMeta[1].probability)}
            </TypeEmphasis>
            {' '}
            chance to contain
            {' '}
            <TypeEmphasis>
              {can.canMeta[1].qtyFloor}
              -
              {can.canMeta[1].qtyCeiling}
            </TypeEmphasis>
            {' '}
            items:
          </Typography>
          <LootTable lootTable={can.lootTable.filter((item) => item.tier === 1)} />
        </Box>
      ) : ''}
      {can.canMeta[2].probability ? (
        <Box>
          <Typography variant="h6" gutterBottom component="div">
            T2 Salvage
          </Typography>
          <Typography>
            <TypeEmphasis>
              {percentLabel(can.canMeta[2].probability)}
            </TypeEmphasis>
            {' '}
            chance to contain
            {' '}
            <TypeEmphasis>
              {can.canMeta[2].qtyFloor}
              -
              {can.canMeta[2].qtyCeiling}
            </TypeEmphasis>
            {' '}
            items:
          </Typography>
          <LootTable lootTable={can.lootTable.filter((item) => item.tier === 2)} />
        </Box>
      ) : ''}
    </Container>
  );
}

Site.defaultProps = {
  size: 0.8,
};

Site.propTypes = {
  size: PropTypes.number,
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

export default Site;
