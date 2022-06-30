import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import TransactionNetworks from '../components/TransactionNetworks';
import InlineLoader from '../components/InlineLoader';
import withdrawCoins from '../utils/ethers/withdrawCoins';
import { ambChainId } from '../utils/providers';
import NetworkOrTokenIcon from '../components/NetworkOrTokenIcon';
import getFee from '../utils/getFee';
import { getNetworkByChainId } from '../utils/networks';
import useError from '../hooks/useError';
import useBridges from '../hooks/useBridges';

const Confirmation = () => {
  const { setError } = useError();
  const { account, library, chainId } = useWeb3React();
  const bridges = useBridges();

  const {
    location: {
      state: {
        destinationChainId,
        selectedCoin,
        receivedCoin,
        transactionAmount,
        foreignChainId,
      },
    },
    goBack,
    push,
  } = useHistory();

  const departureNetwork = getNetworkByChainId(chainId);
  const isFromAmb = chainId === ambChainId;

  const [fee, setFee] = useState('');
  useEffect(async () => {
    const { transferFee, bridgeFee } = await getFee(
      chainId === ambChainId,
      transactionAmount,
      selectedCoin,
      foreignChainId,
    );
    setFee({ transferFee, bridgeFee });
  }, []);
  const [isLocked, setIsLocked] = useState(false);

  const bnTransactionAmount = BigNumber.from(
    utils.parseUnits(transactionAmount, selectedCoin.denomination),
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLocked(true);

    const bridgeAddress =
      bridges[foreignChainId][isFromAmb ? 'native' : 'foreign'];

    withdrawCoins(
      transactionAmount,
      selectedCoin,
      receivedCoin,
      account,
      chainId,
      foreignChainId,
      bridgeAddress,
      library.getSigner(),
    )
      .then((res) => {
        push(`/status/${res.hash}`);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setIsLocked(false);
        if (e.code !== 4001) {
          setError('There is some error. Please refresh and try again');
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          setTimeout(setError, 5000, '');
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} className="content confirmation-page">
      <h2 className="confirmation-page__title">Confirm</h2>
      <p className="confirmation-page__amount">
        {utils.formatUnits(bnTransactionAmount, selectedCoin.denomination)}{' '}
        {selectedCoin.symbol}
      </p>
      <TransactionNetworks selectedChainId={destinationChainId} />
      <div className="confirmation-info">
        <div className="confirmation-info__item">
          <span className="confirmation-info__label">Asset</span>
          <span className="confirmation-info__value">
            <NetworkOrTokenIcon
              symbol={selectedCoin.symbol}
              className="confirmation-info__img"
            />
            {selectedCoin.name}
            {selectedCoin.name !== receivedCoin.name && (
              <>
                <span>→</span>
                <NetworkOrTokenIcon
                  symbol={receivedCoin.symbol}
                  className="confirmation-info__img"
                />
                {receivedCoin.name}
              </>
            )}
          </span>
        </div>
        <div className="confirmation-info__item">
          <span className="confirmation-info__label">Transfer fee</span>
          <span className="confirmation-info__value">
            {fee ? utils.formatEther(fee.transferFee) : <InlineLoader />}{' '}
            {departureNetwork.symbol}
          </span>
        </div>
        <div className="confirmation-info__item">
          <span className="confirmation-info__label">Bridge fee</span>
          <span className="confirmation-info__value">
            {fee ? utils.formatEther(fee.bridgeFee) : <InlineLoader />}{' '}
            {departureNetwork.symbol}
          </span>
        </div>
        <div className="confirmation-info__item">
          <span className="confirmation-info__label">Destination</span>
          <span className="confirmation-info__value">{account}</span>
        </div>
      </div>
      {isLocked ? (
        <div className="confirmation-info__loading">
          <InlineLoader />
          Transaction started. Accept transaction in your wallet.
        </div>
      ) : (
        <div className="btns-wrapper">
          <button
            type="button"
            onClick={goBack}
            className="button button_gray btns-wrapper__btn"
          >
            Back
          </button>
          <button
            type="submit"
            className="button button_black btns-wrapper__btn"
          >
            Confirm
          </button>
        </div>
      )}
    </form>
  );
};

export default Confirmation;
