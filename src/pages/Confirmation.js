import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import TransactionNetworks from '../components/TransactionNetworks';
import createBridgeContract from '../contracts';
import InlineLoader from '../components/InlineLoader';
import ErrorContext from '../contexts/ErrorContext';
import withdrawCoins from '../utils/ethers/withdrawCoins';
import { ambChainId } from '../utils/providers';

const Confirmation = () => {
  const { setError } = useContext(ErrorContext);
  const { account, library, chainId } = useWeb3React();
  const [transferFee, setTransferFee] = useState();

  const {
    location: {
      state: { selectedChainId, selectedCoin, receivedCoin, transactionAmount },
    },
    goBack,
    push,
  } = useHistory();

  const [isLocked, setIsLocked] = useState(false);

  const BridgeContract = createBridgeContract[chainId](library.getSigner());

  useEffect(async () => {
    const fee = await BridgeContract.callStatic.fee();
    setTransferFee(fee);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLocked(true);

    withdrawCoins(
      transactionAmount,
      selectedCoin,
      receivedCoin,
      transferFee,
      account,
      chainId,
      library.getSigner(),
    )
      .then((res) => {
        push(`/status/${res.hash}`);
      })
      .catch((e) => {
        console.error(e);
        setIsLocked(false);
        setError('There is some error. Please refresh and try again');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="content confirmation-page">
      <h2 className="confirmation-page__title">Confirm</h2>
      <p className="confirmation-page__amount">
        {transactionAmount} {selectedCoin.symbol}
      </p>
      <TransactionNetworks selectedChainId={selectedChainId} />
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
            {selectedCoin.name !== receivedCoin.name ? (
              <>
                <span>→</span>
                <img
                  src={receivedCoin.logo}
                  alt={receivedCoin.name}
                  className="confirmation-info__img"
                />
                {receivedCoin.name}
              </>
            ) : null}
          </span>
        </div>
        <div className="confirmation-info__item">
          <span className="confirmation-info__label">Transfer fee</span>
          <span className="confirmation-info__value">
            {transferFee ? utils.formatEther(transferFee) : <InlineLoader />}{' '}
            {selectedChainId === ambChainId ? 'AMB' : 'ETH'}
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
