import PropTypes from 'prop-types';

export const itemDefaults = {
  esiValue: 0,
  evepraisalBuyPrice: 0,
  evepraisalSellPrice: 0,
};

export const itemProps = PropTypes.shape({
  typeID: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  tier: PropTypes.number.isRequired,
  esiValue: PropTypes.number,
  evepraisalBuyPrice: PropTypes.number,
  evepraisalSellPrice: PropTypes.number,
});

export default itemProps;
