import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import TransactionCoins from '../components/TransactionCoins';
import createBridgeContract from '../contracts';
import InlineLoader from '../components/InlineLoader';
import ErrorContext from '../contexts/ErrorContext';
import { AmbrosusNetwork } from '../utils/networks';

const Confirmation = () => {
  const { setError } = useContext(ErrorContext);
  const { account, library } = useWeb3React();
  const [transferFee, setTransferFee] = useState();

  const {
    location: {
      state: { selectedChainId, selectedCoin, transactionAmount, isFromAmb },
    },
    goBack,
    push,
  } = useHistory();

  const signer = library.getSigner();
  const chainId = isFromAmb ? AmbrosusNetwork.chainId : selectedChainId;
  const BridgeContract = createBridgeContract[chainId](signer);

  useEffect(async () => {
    const fee = await BridgeContract.callStatic.fee();
    setTransferFee(fee);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const bnTransactionAmount = BigNumber.from(
      utils.parseUnits(transactionAmount, selectedCoin.denomination),
    );
    const bnTransferFee = BigNumber.from(transferFee);

    BridgeContract.withdraw(
      selectedCoin.nativeContractAddress,
      account,
      bnTransactionAmount,
      { value: bnTransferFee },
    )
      .then((res) => {
        push(`/status/${res.hash}`);
      })
      .catch((e) => {
        console.log(e);
        setError('There is some error. Please refresh and try again');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="content confirmation-page">
      <h2 className="confirmation-page__title">Confirm</h2>
      <p className="confirmation-page__amount">
        {transactionAmount} {selectedCoin.code}
      </p>
      <TransactionCoins from="Ethereum" to="Ambrosus" />
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
