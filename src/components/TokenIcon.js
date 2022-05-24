import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as AmbIcon } from '../assets/icons/amb.svg';
import { ReactComponent as EthIcon } from '../assets/icons/eth.svg';

const iconDict = {
  ETH: EthIcon,
  WETH: EthIcon,
  AMB: AmbIcon,
  SAMB: AmbIcon,
};

const TokenIcon = ({ code, ...props }) => {
  const IconComponent = iconDict[code];
  return IconComponent ? <IconComponent {...props} /> : null;
};

export default TokenIcon;

TokenIcon.propTypes = {
  code: PropTypes.string,
};
