import React from 'react';
import PropTypes from 'prop-types';
import arrowIcon from '../assets/svg/green-arrow-right.svg';
import { ethChainId } from '../utils/providers';
import { AmbrosusNetwork, supportedNetworks } from '../utils/networks';
import getTxLink from '../utils/helpers/getTxLink';
import TokenIcon from './TokenIcon';

const TransactionNetworks = ({ selectedChainId, fromHash, toHash, tokens }) => {
  const networks = supportedNetworks;

  const currentNetwork =
    selectedChainId === ethChainId
      ? networks.find((el) => el.chainId === ethChainId)
      : AmbrosusNetwork;

  const otherNetwork =
    selectedChainId !== ethChainId
      ? networks.find((el) => el.chainId === ethChainId)
      : AmbrosusNetwork;

  return (
    <div className="transaction-coins">
      <div
        className={`transaction-coins__item ${
          fromHash ? 'transaction-coins__item--hash' : ''
        }`}
      >
        {!!selectedChainId && (
          <TokenIcon
            code={currentNetwork.code}
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
            <a
              target="_blank"
              href={getTxLink(selectedChainId === ethChainId, fromHash)}
            >
              {fromHash}
            </a>
          </span>
        )}
        {tokens && (
          <span className="transaction-coins__hash-wrapper">
            <span className="transaction-coins__hash">token:</span>
            {tokens.from}
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
          toHash === null || toHash ? 'transaction-coins__item--hash' : ''
        }`}
      >
        {!!selectedChainId && (
          <TokenIcon
            code={otherNetwork.code}
            className="transaction-coins__img"
          />
        )}

        <div className="transaction-coins__info">
          <p className="transaction-coins__title">To:</p>
          {!!selectedChainId && (
            <p className="transaction-coins__name">{otherNetwork.name}</p>
          )}
        </div>
        {(toHash === null || toHash) && (
          <span className="transaction-coins__hash-wrapper">
            <span className="transaction-coins__hash">txHash:</span>
            {toHash === null ? (
              <span>Transaction not started yet</span>
            ) : (
              <a
                target="_blank"
                href={getTxLink(selectedChainId !== ethChainId, toHash)}
              >
                {toHash}
              </a>
            )}
          </span>
        )}
        {tokens && (
          <span className="transaction-coins__hash-wrapper">
            <span className="transaction-coins__hash">token:</span>
            {tokens.to}
          </span>
        )}
      </div>
    </div>
  );
};

TransactionNetworks.propTypes = {
  selectedChainId: PropTypes.number,
  fromHash: PropTypes.string,
  toHash: PropTypes.string,
  tokens: PropTypes.object,
};

export default TransactionNetworks;
