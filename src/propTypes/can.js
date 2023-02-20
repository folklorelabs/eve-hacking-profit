import PropTypes from 'prop-types';

import { itemProps } from './item';
import { lootTierProps } from './lootTier';

export const canDefaults = {

};

export const canProps = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  faction: PropTypes.oneOf([
    'Angel Cartel',
    'Blood Raiders',
    'Guristas',
    'Sansha\'s Nation',
    'Serpentis',
  ]).isRequired,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  lootTable: PropTypes.arrayOf(itemProps).isRequired,
  lootTiers: PropTypes.arrayOf(lootTierProps).isRequired,
});

export default canProps;
