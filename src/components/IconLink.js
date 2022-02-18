import React from 'react';
import PropTypes from 'prop-types';
import linkIcon from '../assets/svg/link.svg';

const IconLink = ({ text = 'Explorer', href }) => (
  <a href={href} className="icon-link">
    <img src={linkIcon} alt="link" className="icon-link__img" />
    {text}
  </a>
);

IconLink.propTypes = {
  text: PropTypes.string,
  href: PropTypes.string,
};

export default IconLink;
