import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as AmbIcon } from '../assets/icons/amb.svg';
import { ReactComponent as EthIcon } from '../assets/icons/eth.svg';
import { ReactComponent as BnbIcon } from '../assets/icons/bnb.svg';
import { ReactComponent as BscIcon } from '../assets/icons/bsc.svg';

const iconDict = {
  ETH: EthIcon,
  WETH: EthIcon,
  AMB: AmbIcon,
  SAMB: AmbIcon,
  BNB: BnbIcon,
  WBNB: BnbIcon,
  BSC: BscIcon,
};

const NetworkOrTokenIcon = ({ symbol, ...props }) => {
  const IconComponent = iconDict[symbol];
  return IconComponent ? <IconComponent {...props} /> : null;
};

export default NetworkOrTokenIcon;

NetworkOrTokenIcon.propTypes = {
  symbol: PropTypes.string,
};
