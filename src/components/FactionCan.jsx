import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Typography,
} from '@mui/material';

import percentLabel from '../utils/percentLabel';

import {
  useProfitContext,
} from '../contexts/Profit';

import {
  Container,
} from './FactionCan.styles';
import LootTable from './LootTable';
import { TypeEmphasis } from './TypeEmphasis';

function FactionCan({
  factionId,
  canId,
}) {
  const { profitState } = useProfitContext();
  const canMeta = React.useMemo(() => profitState.cans
    .find((can) => can.id === canId), [canId, profitState]);
  const itemTypes = React.useMemo(
    () => canMeta && canMeta.contents.map((c) => c.type),
    [canMeta],
  );
  const factionItemsByItemType = React.useMemo(() => profitState.items
    .filter((item) => item.factions.includes(factionId))
    .filter((item) => itemTypes.includes(item.type))
    .sort((a, b) => b.esiValue - a.esiValue)
    .reduce((all, item) => {
      const newAll = { ...all };
      newAll[item.type] = newAll[item.type] || [];
      newAll[item.type].push(item);
      return newAll;
    }, {}), [factionId, itemTypes, profitState]);
  return (
    <Container className="FactionCan">
      {canMeta && canMeta.contents.map((canContents) => (
        <Box key={`${factionId}_${canId}_${canContents.type}`} sx={{ pr: 8 }}>
          <Typography variant="h6" gutterBottom component="div">
            {profitState.itemTypes.find((t) => t.id === canContents.type).name}
          </Typography>
          <Typography sx={{ maxWidth: 260 }}>
            <TypeEmphasis>
              {percentLabel(canContents.probability)}
            </TypeEmphasis>
            {' '}
            chance for
            {' '}
            <TypeEmphasis>
              {canContents.qtyFloor}
              -
              {canContents.qtyCeiling}
            </TypeEmphasis>
            {' '}
            of each:
          </Typography>
          <LootTable items={factionItemsByItemType[canContents.type]} />
        </Box>
      ))}
    </Container>
  );
}

FactionCan.defaultProps = {

};

FactionCan.propTypes = {
  factionId: PropTypes.oneOf([
    'angel-cartel',
    'blood-raiders',
    'guristas',
    'sanshas-nation',
    'serpentis',
  ]).isRequired,
  canId: PropTypes.string.isRequired,
};

export default FactionCan;
