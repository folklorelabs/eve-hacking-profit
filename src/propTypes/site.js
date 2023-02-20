import PropTypes from 'prop-types';

export const siteDefaults = {

};

export const siteProps = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  difficulty: PropTypes.number.isRequired,
  cans: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    qty: PropTypes.number.isRequired,
  })),
});

export default siteProps;
