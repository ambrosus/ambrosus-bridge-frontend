import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import TransactionCoins from '../components/TransactionCoins';
import createBridgeContract from '../contracts';
import InlineLoader from '../components/InlineLoader';
import ErrorContext from '../contexts/ErrorContext';
import withdrawWrappedCoins from '../utils/ethers/withdrawWrappedCoins';

const Confirmation = () => {
  const { setError } = useContext(ErrorContext);
  const { account, library, chainId } = useWeb3React();
  const [transferFee, setTransferFee] = useState();

  const {
    location: {
      state: { selectedChainId, selectedCoin, transactionAmount },
    },
    goBack,
    push,
  } = useHistory();

  const BridgeContract = createBridgeContract[chainId](library.getSigner());

  useEffect(async () => {
    const fee = await BridgeContract.callStatic.fee();
    setTransferFee(fee);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    withdrawWrappedCoins(
      transactionAmount,
      selectedCoin,
      transferFee,
      account,
      chainId,
      BridgeContract,
    )
      .then((res) => {
        push(`/status/${res.hash}`);
      })
      .catch((e) => {
        console.error(e);
        setError('There is some error. Please refresh and try again');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="content confirmation-page">
      <h2 className="confirmation-page__title">Confirm</h2>
      <p className="confirmation-page__amount">
        {transactionAmount} {selectedCoin.symbol}
      </p>
      <TransactionCoins selectedChainId={selectedChainId} />
      <div className="confirmation-info">
        <div className="confirmation-info__item">
          <span className="confirmation-info__label">Asset</span>
          <span className="confirmation-info__value">
            <img
              src={selectedCoin.logo}
              alt={selectedCoin.name}
              className="confirmation-info__img"
            />
            {selectedCoin.name}
          </span>
        </div>
        <div className="confirmation-info__item">
          <span className="confirmation-info__label">Transfer fee</span>
          <span className="confirmation-info__value">
            {transferFee ? utils.formatEther(transferFee) : <InlineLoader />}{' '}
            ETH
          </span>
        </div>
        <div className="confirmation-info__item">
          <span className="confirmation-info__label">Destination</span>
          <span className="confirmation-info__value">
            {formatAddress(account)}
          </span>
        </div>
      </div>
      <div className="btns-wrapper">
        <button
          type="button"
          onClick={goBack}
          className="button button_gray btns-wrapper__btn"
        >
          Back
        </button>
        <button type="submit" className="button button_black btns-wrapper__btn">
          Confirm
        </button>
      </div>
    </form>
  );
};

const formatAddress = (addr) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

export default Confirmation;
