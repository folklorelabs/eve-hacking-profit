import PropTypes from 'prop-types';

export const itemDefaults = {
  esiValue: 0,
};

export const itemProps = PropTypes.shape({
  typeID: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  factions: PropTypes.arrayOf(PropTypes.string),
  esiValue: PropTypes.number,
});

export default itemProps;
