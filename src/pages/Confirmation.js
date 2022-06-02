import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import TransactionNetworks from '../components/TransactionNetworks';
import InlineLoader from '../components/InlineLoader';
import ErrorContext from '../contexts/ErrorContext';
import withdrawCoins from '../utils/ethers/withdrawCoins';
import { ambChainId } from '../utils/providers';
import TokenIcon from '../components/TokenIcon';
import getFee from '../utils/getFee';

const Confirmation = () => {
  const { setError } = useContext(ErrorContext);
  const { account, library, chainId } = useWeb3React();

  const {
    location: {
      state: { selectedChainId, selectedCoin, receivedCoin, transactionAmount },
    },
    goBack,
    push,
  } = useHistory();

  const [fee, setFee] = useState('');
  useEffect(async () => {
    const { totalFee } = await getFee(
      chainId === selectedChainId,
      transactionAmount,
      selectedCoin,
    );
    setFee(totalFee);
  }, []);
  const [isLocked, setIsLocked] = useState(false);

  const bnTransactionAmount = BigNumber.from(
    utils.parseUnits(transactionAmount, selectedCoin.denomination),
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLocked(true);

    withdrawCoins(
      transactionAmount,
      selectedCoin,
      receivedCoin,
      account,
      chainId,
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
      <TransactionNetworks selectedChainId={selectedChainId} />
      <div className="confirmation-info">
        <div className="confirmation-info__item">
          <span className="confirmation-info__label">Asset</span>
          <span className="confirmation-info__value">
            <TokenIcon
              code={selectedCoin.symbol}
              className="confirmation-info__img"
            />
            {selectedCoin.name}
            {selectedCoin.name !== receivedCoin.name ? (
              <>
                <span>→</span>
                <TokenIcon
                  code={receivedCoin.symbol}
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
            {fee ? utils.formatEther(fee) : <InlineLoader />}{' '}
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
