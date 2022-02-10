import React from 'react';
import PropTypes from 'prop-types';
import CurrencyInput from '../CurrencyInput';
import SwapButton from '../../assets/svg/exchange__swap-button.svg';
import NetworkSelect from '../NetworkSelect';

const Exchange = () => (
  <div className="content exchange">
    <h2 className="exchange__heading">Select Network and enter amount</h2>
    <div className="exchange__fields">
      <ExchangeField />
      <img
        src={SwapButton}
        alt="swap button"
        className="exchange__swap-button"
      />
      <ExchangeField isReceive />
    </div>
    <div className="exchange__estimated-fee-container">
      Estimated transfer fee:
      <span className="exchange__estimated-fee">0.08 ETH.AM</span>
    </div>
    <button type="button" className="button button_black exchange__button">
      Transfer
    </button>
  </div>
);

export default Exchange;

const ExchangeField = ({ isReceive = false }) => (
  <div className="exchange-field">
    <span className="exchange-field__network-destination">
      {isReceive ? 'To: ' : 'From: '}
    </span>

    <NetworkSelect disabled={isReceive} />

    <div className="exchange-field__balance-container">
      Balance:
      <span className="exchange-field__balance">13.86 ETH.AM</span>
    </div>

    <CurrencyInput isReceive={isReceive} />
  </div>
);

ExchangeField.propTypes = {
  isReceive: PropTypes.bool,
};
