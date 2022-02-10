import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ChevronIcon from '../assets/svg/chevron.svg';

const CurrencyInput = ({ isReceive = false }) => {
  const [value, setValue] = useState(0.0);

  const handleInput = (e) => setValue(e.target.value);

  return (
    <div
      className={`currency-input ${isReceive ? 'currency-input_receive' : ''}`}
    >
      <label className="currency-input__label">
        {isReceive ? 'Receive:' : 'Send:'}
      </label>
      <input
        type="number"
        placeholder="0.0"
        value={value}
        className="currency-input__input"
        onChange={handleInput}
        readOnly={isReceive}
      />
      <button type="button" className="currency-input__max-button">
        Max
      </button>
      <button type="button" className="currency-input__coin-button">
        {/* mock image */}
        <img
          src="https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/tokens/WETH/logo.png"
          alt="#"
          className="currency-input__currency-icon"
        />
        ETH
        <img
          src={ChevronIcon}
          alt="chevron icon"
          className="currency-input__chevron-icon"
        />
      </button>
    </div>
  );
};

CurrencyInput.propTypes = {
  isReceive: PropTypes.bool,
};

export default CurrencyInput;
