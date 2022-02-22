import React from 'react';
import PropTypes from 'prop-types';
import ChevronIcon from '../assets/svg/chevron.svg';

const NetworkSelect = ({ disabled = false }) => (
  <div
    className={`network-select ${disabled ? 'network-select_disabled' : ''}`}
  >
    <div
      className="network-select__absolute-wrapper"
      style={{ '--items-amount': 2 }} // 2 is mock const, it will be amount of networks
    >
      <div className="network-select__option">
        {/* mock image */}
        <img
          src="https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/WETH/logo.png"
          alt="#"
          className="network-select__currency-icon"
        />
        Ethereum
      </div>
      <div className="network-select__option">
        {/* mock image */}
        <img
          src="https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/WETH/logo.png"
          alt="#"
          className="network-select__currency-icon"
        />
        Binance Smart Chain
      </div>
    </div>
    <img
      src={ChevronIcon}
      alt="chevron icon"
      className="network-select__chevron"
    />
  </div>
);

NetworkSelect.propTypes = {
  disabled: PropTypes.bool,
};

export default NetworkSelect;
