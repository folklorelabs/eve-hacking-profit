import PropTypes from 'prop-types';

import { itemProps } from './item';
import { canTierMetaProps } from './lootTier';

export const siteDefaults = {

};

export const siteProps = PropTypes.shape({
  id: PropTypes.string.isRequired,
  siteType: PropTypes.string.isRequired,
  faction: PropTypes.oneOf([
    'Angel Cartel',
    'Blood Raiders',
    'Guristas',
    'Sansha\'s Nation',
    'Serpentis',
  ]).isRequired,
  difficulty: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  lootTable: PropTypes.arrayOf(itemProps).isRequired,
  canTierMeta: PropTypes.arrayOf(canTierMetaProps).isRequired,
});

export default siteProps;
