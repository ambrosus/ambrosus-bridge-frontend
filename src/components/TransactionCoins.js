import React from 'react';
import PropTypes from 'prop-types';
import git from '../assets/svg/github-icon.svg';
import arrowIcon from '../assets/svg/green-arrow-right.svg';

const TransactionCoins = ({ from, to, fromHash, toHash }) => (
  <div className="transaction-coins">
    <div
      className={`transaction-coins__item ${
        fromHash ? 'transaction-coins__item--hash' : ''
      }`}
    >
      <img src={git} alt="coin name" className="transaction-coins__img" />
      <div className="transaction-coins__info">
        <p className="transaction-coins__title">Send:</p>
        <p className="transaction-coins__name">{from}</p>
      </div>
      {fromHash && (
        <span className="transaction-coins__hash-wrapper">
          <span className="transaction-coins__hash">txHash:</span>
          {fromHash}
        </span>
      )}
    </div>
    <img
      src={arrowIcon}
      alt="arrow right"
      className="transaction-coins__arrow"
    />
    <div
      className={`transaction-coins__item ${
        toHash ? 'transaction-coins__item--hash' : ''
      }`}
    >
      <img src={git} alt="coin name" className="transaction-coins__img" />
      <div className="transaction-coins__info">
        <p className="transaction-coins__title">To:</p>
        <p className="transaction-coins__name">{to}</p>
      </div>
      {toHash && (
        <span className="transaction-coins__hash-wrapper">
          <span className="transaction-coins__hash">txHash:</span>
          {toHash}
        </span>
      )}
    </div>
  </div>
);

TransactionCoins.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  fromHash: PropTypes.string,
  toHash: PropTypes.string,
};

export default TransactionCoins;
