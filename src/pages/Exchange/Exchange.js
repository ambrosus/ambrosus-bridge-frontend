import React, { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
import { utils } from 'ethers';
import { Link } from 'react-router-dom';
import ErrorContext from '../../contexts/ErrorContext';
import CoinBalanceWorkerContext from '../../contexts/CoinBalanceWorkerContext/context';
import { AmbrosusNetwork, getSupportedNetworks } from '../../utils/networks';
import changeChainId from '../../utils/ethers/changeChainId';
import SwapButton from '../../assets/svg/exchange__swap-button.svg';
import InlineLoader from '../../components/InlineLoader';
import ExchangeField from './ExchangeField';
import createBridgeContract from '../../contracts';
import { ambChainId, ethChainId } from '../../utils/providers';
import validateTransactionAmount from '../../utils/ethers/validateTransactionAmount';
import ReceiveField from './ReceiveField';
import { nativeTokensById } from '../../utils/nativeTokens';

const Exchange = () => {
  const { setError } = useContext(ErrorContext);
  const [networks, setNetworks] = useState(undefined);

  const { library, account, chainId } = useWeb3React();

  const isFromAmb = chainId === ambChainId;
  const toggleDirection = async () => {
    const newChainId = isFromAmb ? ethChainId : ambChainId;
    await changeChainId(library.provider, newChainId);
  };

  const [selectedCoin, setCoin] = useState();
  console.log('selected coin', selectedCoin);
  const [receivedCoin, setReceivedCoin] = useState();
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transferFee, setTransferFee] = useState(null);

  const worker = useContext(CoinBalanceWorkerContext);

  // setting init values
  useEffect(async () => {
    const supportedNetworks = getSupportedNetworks();
    setNetworks(supportedNetworks);
    setCoin(nativeTokensById[chainId]);
    worker.postMessage({ type: 'start', account });
  }, []);

  // if network changed update transaction fee
  useEffect(async () => {
    const BridgeContract = createBridgeContract[chainId](library);
    const fee = await BridgeContract.callStatic.fee();
    setTransferFee(utils.formatEther(fee));
  }, [chainId]);

  // reset value if coin changed
  useEffect(() => {
    setTransactionAmount('');
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
    );

    if (errorMessage) {
      setIsInvalid(!!errorMessage);
      setError(errorMessage);
    } else {
      history.push({
        pathname: '/confirm',
        state: {
          selectedChainId: chainId,
          selectedCoin,
          receivedCoin,
          transactionAmount,
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
        Transfer fee:
        <span className="exchange__estimated-fee">
          {transferFee || <InlineLoader />} {isFromAmb ? 'AMB' : 'ETH'}
        </span>
      </div>
      <button type="submit" className="button button_black exchange__button">
        Transfer
      </button>
      <Link
        to="/mint"
        style={{ marginTop: 16 }}
        className="button button_gray exchange__button"
      >
        Mint Coins
      </Link>
    </form>
  );
};

export default Exchange;
