import PropTypes from 'prop-types';

export const siteMetaDefaults = {
  probability: 0,
  qtyCeiling: 0,
  qtyFloor: 0,
};

export const siteMetaProps = PropTypes.shape({
  probability: PropTypes.number,
  qtyCeiling: PropTypes.number,
  qtyFloor: PropTypes.number,
});

export default siteMetaProps;
