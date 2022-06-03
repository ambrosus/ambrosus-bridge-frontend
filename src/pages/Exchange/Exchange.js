import React, { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
import { utils } from 'ethers';
import ErrorContext from '../../contexts/ErrorContext';
import CoinBalanceWorkerContext from '../../contexts/CoinBalanceWorkerContext/context';
import { AmbrosusNetwork, supportedNetworks } from '../../utils/networks';
import changeChainId from '../../utils/ethers/changeChainId';
import SwapButton from '../../assets/svg/exchange__swap-button.svg';
import InlineLoader from '../../components/InlineLoader';
import ExchangeField from './ExchangeField';
import { ambChainId, ethChainId } from '../../utils/providers';
import validateTransactionAmount from '../../utils/ethers/validateTransactionAmount';
import ReceiveField from './ReceiveField';
import { nativeTokensById } from '../../utils/nativeTokens';
import getFee from '../../utils/getFee';

const Exchange = () => {
  const { setError } = useContext(ErrorContext);
  const { library, account, chainId } = useWeb3React();

  const networks = supportedNetworks;
  const isFromAmb = chainId === ambChainId;

  const toggleDirection = async () => {
    const newChainId = isFromAmb ? ethChainId : ambChainId;
    await changeChainId(library.provider, newChainId);
  };

  const [selectedCoin, setCoin] = useState(nativeTokensById[chainId]);
  const [receivedCoin, setReceivedCoin] = useState({});
  const [transactionAmount, setTransactionAmount] = useState('');

  const worker = useContext(CoinBalanceWorkerContext);

  // starting balance-fetching worker and clearing it on unmount
  useEffect(() => {
    worker.postMessage({ type: 'start', account });
    return () => {
      worker.postMessage({ type: 'stop', account });
    };
  }, []);

  // if network changed update transaction fee
  useEffect(() => {
    setCoin(nativeTokensById[chainId]);
  }, [chainId]);

  // reset value if coin changed
  useEffect(() => {
    setTransactionAmount('');
  }, [selectedCoin]);

  const [fee, setFee] = useState('');
  const updateFee = async () => {
    setFee(undefined);
    const { transferFee, bridgeFee, totalFee } = await getFee(
      isFromAmb,
      transactionAmount,
      selectedCoin,
    );
    setFee({ transferFee, bridgeFee, totalFee });
  };
  useEffect(updateFee, [chainId]);
  useEffect(async () => {
    setFee(undefined);
    const { transferFee, bridgeFee, totalFee } = await getFee(
      isFromAmb,
      '0.001',
      selectedCoin,
    );
    setFee({ transferFee, bridgeFee, totalFee });
  }, [selectedCoin]);

  const [isValueInvalid, setIsInvalid] = useState(false);
  const history = useHistory();

  const handleTransaction = async (e) => {
    e.preventDefault();
    const errorMessage = await validateTransactionAmount(
      library,
      selectedCoin.address,
      transactionAmount,
      selectedCoin.denomination,
      account,
      fee,
    );

    if (errorMessage) {
      setIsInvalid(!!errorMessage);
      setError(errorMessage);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      history.push({
        pathname: '/confirm',
        state: {
          selectedChainId: chainId,
          selectedCoin,
          receivedCoin,
          transactionAmount,
          fee,
        },
      });
    }
  };

  // remove error on any change until new form submission
  useEffect(() => {
    setError(null);
    setIsInvalid(false);
  }, [transactionAmount, selectedCoin, chainId]);

  return (
    <form className="content exchange" onSubmit={handleTransaction}>
      <h2 className="exchange__heading">Select Network and enter amount</h2>
      <div className="exchange__fields">
        <ExchangeField
          {...{
            networks: isFromAmb ? [AmbrosusNetwork] : networks,
            selectedChainId: chainId,
            selectedCoin,
            transactionAmount,
            setTransactionAmount,
            isValueInvalid,
            isFromAmb,
            setCoin,
            updateFee,
          }}
        />
        <button type="button" onClick={toggleDirection}>
          <img
            src={SwapButton}
            alt="swap button"
            className="exchange__swap-button"
          />
        </button>
        <ReceiveField
          {...{
            networks: isFromAmb ? networks : [AmbrosusNetwork],
            selectedChainId: chainId,
            setCoin: setReceivedCoin,
            selectedCoin,
            receivedCoin,
            transactionAmount,
          }}
        />
      </div>
      <div className="exchange__estimated-fee-container">
        <div className="exchange__estimated-fee-row exchange__estimated-fee-row_transfer">
          Transfer fee:
          <span className="exchange__estimated-fee">
            {fee ? utils.formatEther(fee.transferFee) : <InlineLoader />}{' '}
            {isFromAmb ? 'AMB' : 'ETH'}
          </span>
        </div>
        <div className="exchange__estimated-fee-row">
          Bridge fee:
          <span className="exchange__estimated-fee">
            {fee ? utils.formatEther(fee.bridgeFee) : <InlineLoader />}{' '}
            {isFromAmb ? 'AMB' : 'ETH'}
          </span>
        </div>
      </div>
      <button type="submit" className="button button_black exchange__button">
        Transfer
      </button>
    </form>
  );
};

export default Exchange;
