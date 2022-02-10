import React from 'react';
import CurrencyInput from '../CurrencyInput';
import SwapButton from '../../assets/svg/exchange__swap-button.svg';

const Exchange = () => (
  <div className="content exchange">
    <h2 className="exchange__heading">Select Network and enter amount</h2>
    <div className="exchange__fields">
      <div className="exchange__field">
        <CurrencyInput />
      </div>
      <img
        src={SwapButton}
        alt="swap button"
        className="exchange__swap-button"
      />
      <div className="exchange__field">
        <CurrencyInput isReceive />
      </div>
    </div>
  </div>
);

export default Exchange;
