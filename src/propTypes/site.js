import PropTypes from 'prop-types';

import { canProps } from './can';

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
  cans: PropTypes.arrayOf(canProps).isRequired,
});

export default siteProps;
