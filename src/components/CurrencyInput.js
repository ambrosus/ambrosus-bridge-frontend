import React from 'react';
import PropTypes from 'prop-types';
import ChevronIcon from '../assets/svg/chevron.svg';

const CurrencyInput = ({
  disabled = false,
  value = '',
  onChange = () => {},
  changeCoin = () => {},
  selectedCoin = {},
  balance = {},
  isValueInvalid = false,
}) => {
  const handleInput = ({ target: { value: newValue } }) => {
    onChange(newValue);
  };

  const handleKeyPress = (e) => {
    // discard all symbols except listed in regex
    if (!/(1|2|3|4|5|6|7|8|9|0|,)/.test(e.key)) {
      e.preventDefault();
    }
  };

  const setMax = () => {
    onChange(balance.formattedString);
  };

  return (
    <div
      className={`currency-input
       ${disabled ? 'currency-input_receive' : ''}
       ${isValueInvalid ? 'currency-input_invalid' : ''}
       ${value.length > 12 ? 'currency-input_too-long' : ''}
       `}
    >
      <label className="currency-input__label">
        {disabled ? 'Receive:' : 'Send:'}
      </label>
      <input
        type="number"
        placeholder="0,0"
        value={value}
        className="currency-input__input"
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        readOnly={disabled}
      />
      <button
        type="button"
        className="currency-input__max-button"
        onClick={setMax}
      >
        Max
      </button>
      <button
        type="button"
        className="currency-input__coin-button"
        onClick={changeCoin}
      >
        {/* mock image */}
        <img
          src={selectedCoin.logo}
          alt="#"
          className="currency-input__currency-icon"
        />
        {selectedCoin.code}
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
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  changeCoin: PropTypes.func,
  selectedCoin: PropTypes.object,
  balance: PropTypes.object,
  isValueInvalid: PropTypes.bool,
};

export default CurrencyInput;
