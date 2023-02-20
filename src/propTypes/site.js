import PropTypes from 'prop-types';

import { itemProps } from './item';

export const siteDefaults = {

};

export const siteProps = PropTypes.shape({
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
});

export default siteProps;
