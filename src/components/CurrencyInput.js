import React from 'react';
import PropTypes from 'prop-types';
import ChevronIcon from '../assets/svg/chevron.svg';

const CurrencyInput = ({
  disabled = false,
  value = undefined,
  onChange = () => {},
  changeCoin = () => {},
  selectedCoin = {},
}) => {
  const handleInput = ({ target: { value: rawValue } }) => {
    try {
      const inputValue = parseInt(rawValue, 10);
      if (inputValue < 0) {
        onChange(0);
      } else if (selectedCoin.balance && inputValue > selectedCoin.balance) {
        onChange(selectedCoin.balance);
      } else {
        onChange(inputValue);
      }
    } catch (e) {
      onChange(0);
    }
  };

  return (
    <div
      className={`currency-input ${disabled ? 'currency-input_receive' : ''}`}
    >
      <label className="currency-input__label">
        {disabled ? 'Receive:' : 'Send:'}
      </label>
      <input
        type="number"
        placeholder="0.0"
        value={value}
        className="currency-input__input"
        onChange={handleInput}
        readOnly={disabled}
        max={selectedCoin.balance || null}
      />
      <button
        type="button"
        className="currency-input__max-button"
        onClick={
          selectedCoin.balance
            ? () => onChange(selectedCoin.balance)
            : undefined
        }
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
  value: PropTypes.number,
  onChange: PropTypes.func,
  changeCoin: PropTypes.func,
  selectedCoin: PropTypes.object,
};

export default CurrencyInput;
