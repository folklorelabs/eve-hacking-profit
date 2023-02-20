import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Typography,
} from '@mui/material';
import percentLabel from '../utils/percentLabel';

import {
  Container,
} from './Site.styles';
import LootTable from './LootTable';
import { TypeEmphasis } from './TypeEmphasis';
import { siteMetaProps } from '../propTypes/siteMeta';
import { siteProps } from '../propTypes/site';

function Site({
  site,
  siteMeta,
  size,
}) {
  return (
    <Container className="Site" size={size}>
      {Object.keys(can.canMeta).filter((tier) => !!can.canMeta[tier].probability).map((tier) => (
        <Box sx={{ pr: 8 }}>
          <Typography variant="h6" gutterBottom component="div">
            T
            {tier}
            {' '}
            Salvage
          </Typography>
          <Typography sx={{ maxWidth: 260 }}>
            <TypeEmphasis>
              {percentLabel(can.canMeta[tier].probability)}
            </TypeEmphasis>
            {' '}
            chance to contain
            {' '}
            <TypeEmphasis>
              {can.canMeta[tier].qtyFloor}
              -
              {can.canMeta[tier].qtyCeiling}
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

Site.defaultProps = {
  size: 0.8,
};

Site.propTypes = {
  size: PropTypes.number,
  site: siteProps,
  siteMeta: siteMetaProps,
};

export default Site;
