import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ChevronIcon from '../../assets/svg/chevron.svg';
import useGetMaxTxAmount from '../../hooks/useSetMax';
import TokenIcon from '../../components/TokenIcon';

const CurrencyInput = ({
  disabled = false,
  value = '',
  onChange = () => {},
  changeCoin = () => {},
  selectedCoin = {},
  isValueInvalid = false,
  onBlur = () => {},
  setError = () => {},
}) => {
  const [timer, setTimer] = useState();

  const handleInput = ({ target: { value: newValue } }) => {
    const formattedValue = newValue.replace(',', '.');
    if (/^\d*(\.\d{0,8})?$/.test(formattedValue) || formattedValue === '') {
      onChange(formattedValue);

      if (timer) clearTimeout(timer);
      setTimer(setTimeout(onBlur, 1000, formattedValue));
    }
  };

  const handleKeyPress = (e) => {
    // discard all symbols except listed in regex
    if (!/(1|2|3|4|5|6|7|8|9|0|,|\.)/.test(e.key)) {
      e.preventDefault();
    }
  };

  const getMaxTxAmount = useGetMaxTxAmount(selectedCoin, value);
  const setMax = async () => {
    try {
      const maxTxAmount = await getMaxTxAmount();
      onChange(maxTxAmount);
      onBlur(maxTxAmount);
    } catch (e) {
      // TODO: make setError hook
      setError('Your balance is smaller than total fee');
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setTimeout(setError, 5000, '');
    }
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
        type="text"
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
        <TokenIcon
          code={selectedCoin.symbol}
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
  onBlur: PropTypes.func,
  setError: PropTypes.func,
};

export default CurrencyInput;
