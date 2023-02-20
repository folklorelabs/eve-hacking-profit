import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Typography,
} from '@mui/material';
import { canProps } from '../propTypes/can';

import percentLabel from '../utils/percentLabel';

import {
  Container,
} from './Can.styles';
import LootTable from './LootTable';
import { TypeEmphasis } from './TypeEmphasis';

function Can({
  can,
  size,
}) {
  return (
    <Container className="Can" size={size}>
      {can.lootTiers.filter((tier) => !!tier.probability).map((lootTier) => (
        <Box key={`${can.id}_${lootTier.id}`} sx={{ pr: 8 }}>
          <Typography variant="h6" gutterBottom component="div">
            T
            {lootTier.id}
            {' '}
            Salvage
          </Typography>
          <Typography sx={{ maxWidth: 260 }}>
            <TypeEmphasis>
              {percentLabel(lootTier.probability)}
            </TypeEmphasis>
            {' '}
            chance to contain
            {' '}
            <TypeEmphasis>
              {lootTier.qtyFloor}
              -
              {lootTier.qtyCeiling}
            </TypeEmphasis>
            {' '}
            items:
          </Typography>
          <LootTable lootTable={can.lootTable.filter((item) => `${item.tier}` === lootTier.id)} />
        </Box>
      ))}
    </Container>
  );
}

Can.defaultProps = {
  size: 0.8,
};

Can.propTypes = {
  size: PropTypes.number,
  can: canProps.isRequired,
};

export default Can;
