import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import arrowIcon from '../assets/svg/green-arrow-right.svg';
import { AmbrosusNetwork, supportedNetworks } from '../utils/networks';
import NetworkOrTokenIcon from './NetworkOrTokenIcon';
import useBridges from '../hooks/useBridges';

const TransactionNetworks = ({
  departureContractAddress,
  fromHash,
  toHash,
  tokens,
  preventRedirect,
  departureNetwork,
  destinationNetwork,
}) => {
  const networks = supportedNetworks;
  const bridges = useBridges();

  const [currentNetwork, setCurrentNetwork] = useState(departureNetwork);
  const [otherNetwork, setOtherNetwork] = useState(destinationNetwork);

  useEffect(() => {
    if (bridges) {
      Object.keys(bridges).forEach((id) => {
        Object.keys(bridges[id]).forEach((type) => {
          if (departureContractAddress === bridges[id][type]) {
            if (type === 'native') {
              setCurrentNetwork(AmbrosusNetwork);
              setOtherNetwork(networks.find((el) => el.chainId === +id));
            } else {
              setCurrentNetwork(networks.find((el) => el.chainId === +id));
              setOtherNetwork(AmbrosusNetwork);
            }
          }
        });
      });
    }
  }, [departureContractAddress]);

  return (
    <div className="transaction-coins">
      <div
        className={`transaction-coins__item ${
          fromHash ? 'transaction-coins__item--hash' : ''
        }`}
      >
        {!!currentNetwork && (
          <NetworkOrTokenIcon
            symbol={currentNetwork.code}
            className="transaction-coins__img"
          />
        )}
        <div className="transaction-coins__info">
          <p className="transaction-coins__title">Send:</p>
          {!!currentNetwork && (
            <p className="transaction-coins__name">{currentNetwork.name}</p>
          )}
        </div>
        {fromHash && (
          <span className="transaction-coins__hash-wrapper">
            <span className="transaction-coins__hash">txHash:</span>
            <a
              style={preventRedirect ? { pointerEvents: 'none' } : {}}
              target="_blank"
              href={`${
                departureNetwork ? departureNetwork.explorerUrl : ''
              }tx/${fromHash}`}
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
        {!!otherNetwork && (
          <NetworkOrTokenIcon
            symbol={otherNetwork.code}
            className="transaction-coins__img"
          />
        )}

        <div className="transaction-coins__info">
          <p className="transaction-coins__title">To:</p>
          {!!otherNetwork && (
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
                href={`${
                  destinationNetwork ? destinationNetwork.explorerUrl : ''
                }tx/${toHash}`}
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
  departureContractAddress: PropTypes.string,
  fromHash: PropTypes.string,
  toHash: PropTypes.string,
  tokens: PropTypes.object,
  preventRedirect: PropTypes.bool,
  departureNetwork: PropTypes.object,
  destinationNetwork: PropTypes.object,
};

export default TransactionNetworks;
