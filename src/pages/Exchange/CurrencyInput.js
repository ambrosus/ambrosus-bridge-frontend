import React from 'react';
import PropTypes from 'prop-types';
import ChevronIcon from '../../assets/svg/chevron.svg';
import useGetMaxTxAmount from '../../hooks/useSetMax';

const CurrencyInput = ({
  disabled = false,
  value = '',
  onChange = () => {},
  changeCoin = () => {},
  selectedCoin = {},
  isValueInvalid = false,
}) => {
  const handleInput = ({ target: { value: newValue } }) => {
    const [intPart, floatPart] = newValue.replace(',', '.').split('.');
    let formattedValue;
    if (floatPart && floatPart.length > 8) {
      formattedValue = `${intPart}.${floatPart.slice(0, 8)}`;
    } else if (floatPart) {
      formattedValue = `${intPart}.${floatPart}`;
    } else {
      formattedValue = intPart;
    }
    onChange(formattedValue);
  };

  const handleKeyPress = () => {
    // discard all symbols except listed in regex
  };

  const getMaxTxAmount = useGetMaxTxAmount(selectedCoin, value);
  const setMax = async () => {
    onChange(await getMaxTxAmount());
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
        placeholder="0.0"
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
        <img
          src={selectedCoin.logo}
          alt="#"
          className="currency-input__currency-icon"
        />
        {selectedCoin.symbol}
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
  isValueInvalid: PropTypes.bool,
};

export default CurrencyInput;
