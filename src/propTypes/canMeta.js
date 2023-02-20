import PropTypes from 'prop-types';

export const canMetaDefaults = {
  probability: 0,
  qtyCeiling: 0,
  qtyFloor: 0,
};

export const canMetaProps = PropTypes.shape({
  probability: PropTypes.number,
  qtyCeiling: PropTypes.number,
  qtyFloor: PropTypes.number,
});

export default canMetaProps;
