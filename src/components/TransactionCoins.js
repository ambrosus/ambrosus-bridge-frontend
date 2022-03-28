import React from 'react';
import PropTypes from 'prop-types';
import arrowIcon from '../assets/svg/green-arrow-right.svg';
import { ethChainId } from '../utils/providers';
import { AmbrosusNetwork, getSupportedNetworks } from '../utils/networks';

const TransactionCoins = ({ selectedChainId, fromHash, toHash }) => {
  const networks = getSupportedNetworks();

  const currentNetwork =
    selectedChainId === ethChainId
      ? networks.find((el) => el.chainId === ethChainId)
      : AmbrosusNetwork;

  const otherNetwork =
    selectedChainId !== ethChainId
      ? networks.find((el) => el.chainId === ethChainId)
      : AmbrosusNetwork;

  console.log(currentNetwork, otherNetwork);
  return (
    <div className="transaction-coins">
      <div
        className={`transaction-coins__item ${
          fromHash ? 'transaction-coins__item--hash' : ''
        }`}
      >
        {!!selectedChainId && (
          <img
            src={currentNetwork.logo}
            alt="coin name"
            className="transaction-coins__img"
          />
        )}
        <div className="transaction-coins__info">
          <p className="transaction-coins__title">Send:</p>
          {!!selectedChainId && (
            <p className="transaction-coins__name">{currentNetwork.name}</p>
          )}
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
        {!!selectedChainId && (
          <img
            src={otherNetwork.logo}
            alt="coin name"
            className="transaction-coins__img"
          />
        )}
        <div className="transaction-coins__info">
          <p className="transaction-coins__title">To:</p>
          {!!selectedChainId && (
            <p className="transaction-coins__name">{otherNetwork.name}</p>
          )}
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
};

TransactionCoins.propTypes = {
  selectedChainId: PropTypes.number,
  fromHash: PropTypes.string,
  toHash: PropTypes.string,
};

export default TransactionCoins;
