import PropTypes from 'prop-types';

export const lootTierDefaults = {
  id: 0,
  probability: 0,
  qtyCeiling: 0,
  qtyFloor: 0,
};

export const lootTierProps = PropTypes.shape({
  id: PropTypes.string,
  probability: PropTypes.number,
  qtyCeiling: PropTypes.number,
  qtyFloor: PropTypes.number,
});

export default lootTierProps;
