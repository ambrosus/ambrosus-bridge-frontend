import React, { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
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
import formatBalance from '../../utils/helpers/formatBalance';
import useError from '../../hooks/useError';

const Exchange = () => {
  const { setError } = useError();
  const { library, account, chainId } = useWeb3React();
  // TODO ?
  const networks = supportedNetworks;

  const isFromAmb = chainId === ambChainId;
  const [foreignChainId, setForeignChainId] = useState(
    isFromAmb ? ethChainId : chainId,
  );
  const destinationChainId = isFromAmb ? foreignChainId : ambChainId;

  const changeNetwork = async (newChainId) => {
    if (!isFromAmb) {
      await changeChainId(library.provider, newChainId);
    }
    setForeignChainId(newChainId);
  };

  const toggleDirection = async () => {
    const newChainId = isFromAmb ? foreignChainId : ambChainId;
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
      worker.postMessage({ type: 'stop' });
    };
  }, []);

  // handling account change
  useEffect(() => {
    worker.postMessage({ type: 'restart', account });
  }, [account]);

  // if network changed update transaction fee
  useEffect(() => {
    setCoin(nativeTokensById[chainId]);
  }, [chainId, foreignChainId]);

  // reset value if coin changed
  useEffect(() => {
    setTransactionAmount('');
  }, [selectedCoin]);

  // TODO state type
  const [fee, setFee] = useState();
  const updateFee = async (amount) => {
    setFee(undefined);
    const { transferFee, bridgeFee, totalFee } = await getFee(
      isFromAmb,
      amount,
      selectedCoin,
      foreignChainId,
    );
    setFee({ transferFee, bridgeFee, totalFee });
  };
  useEffect(() => updateFee(transactionAmount), [chainId, foreignChainId]);
  useEffect(() => updateFee('0.001'), [selectedCoin]);

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
          foreignChainId,
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
            setChainId: changeNetwork,
            chainId,
            foreignChainId,
            selectedCoin,
            transactionAmount,
            setTransactionAmount,
            isValueInvalid,
            isFromAmb,
            setCoin,
            updateFee,
            setError,
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
            setChainId: changeNetwork,
            chainId,
            destinationChainId,
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
            {fee ? formatBalance(fee.transferFee.toString()) : <InlineLoader />}{' '}
            {isFromAmb ? 'AMB' : 'ETH'}
          </span>
        </div>
        <div className="exchange__estimated-fee-row">
          Bridge fee:
          <span className="exchange__estimated-fee">
            {fee ? formatBalance(fee.bridgeFee.toString()) : <InlineLoader />}{' '}
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
