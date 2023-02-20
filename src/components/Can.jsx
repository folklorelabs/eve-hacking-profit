import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Typography,
} from '@mui/material';
import { canProps } from '../propTypes/can';
import { canMetaProps } from '../propTypes/canMeta';

import percentLabel from '../utils/percentLabel';

import {
  Container,
} from './Can.styles';
import LootTable from './LootTable';
import { TypeEmphasis } from './TypeEmphasis';

function Can({
  can,
  canMeta,
  size,
}) {
  return (
    <Container className="Can" size={size}>
      {Object.keys(canMeta).filter((tier) => !!canMeta[tier].probability).map((tier) => (
        <Box key={`${can.id}_${tier}`} sx={{ pr: 8 }}>
          <Typography variant="h6" gutterBottom component="div">
            T
            {tier}
            {' '}
            Salvage
          </Typography>
          <Typography sx={{ maxWidth: 260 }}>
            <TypeEmphasis>
              {percentLabel(canMeta[tier].probability)}
            </TypeEmphasis>
            {' '}
            chance to contain
            {' '}
            <TypeEmphasis>
              {canMeta[tier].qtyFloor}
              -
              {canMeta[tier].qtyCeiling}
            </TypeEmphasis>
            {' '}
            items:
          </Typography>
          <LootTable lootTable={can.lootTable.filter((item) => `${item.tier}` === tier)} />
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
  canMeta: canMetaProps.isRequired,
};

export default Can;
