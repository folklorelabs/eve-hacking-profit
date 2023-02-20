import PropTypes from 'prop-types';

export const canDefaults = {

};

export const canProps = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  contents: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    probability: PropTypes.number.isRequired,
    qtyFloor: PropTypes.number.isRequired,
    qtyCeiling: PropTypes.number.isRequired,
  })).isRequired,
});

export default canProps;
