import React, { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
import { utils } from 'ethers';
import { Link } from 'react-router-dom';
import ErrorContext from '../../contexts/ErrorContext';
import useModal from '../../hooks/useModal';
import CoinBalanceWorkerContext from '../../contexts/CoinBalanceWorkerContext/context';
import { AmbrosusNetwork, getSupportedNetworks } from '../../utils/networks';
import changeChainId from '../../utils/ethers/changeChainId';
import SwapButton from '../../assets/svg/exchange__swap-button.svg';
import InlineLoader from '../../components/InlineLoader';
import ExchangeField from './ExchangeField';
import createBridgeContract from '../../contracts';
import TokenSelect from './TokenSelect';
import { ambChainId, ethChainId } from '../../utils/providers';
import TokenListContext from '../../contexts/TokenListContext/context';
import validateTransactionAmount from '../../utils/ethers/validateTransactionAmount';

const Exchange = () => {
  const { setError } = useContext(ErrorContext);
  const tokenList = useContext(TokenListContext);
  const [networks, setNetworks] = useState(undefined);

  const { library, account, chainId } = useWeb3React();
  const isFromAmb = chainId === ambChainId;
  const toggleDirection = async () => {
    const newChainId = isFromAmb ? ethChainId : ambChainId;
    await changeChainId(library.provider, newChainId);
  };

  const [selectedCoin, setCoin] = useState(tokenList[0]);

  const [transactionAmount, setTransactionAmount] = useState('');

  const [isOpenCoinModal, toggleCoinModal] = useModal();

  const [transferFee, setTransferFee] = useState(null);

  const worker = useContext(CoinBalanceWorkerContext);

  // setting init values
  useEffect(async () => {
    const supportedNetworks = getSupportedNetworks();
    setNetworks(supportedNetworks);
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
      selectedCoin.addresses[chainId],
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
          chainId,
          selectedCoin,
          isFromAmb,
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
    <>
      <TokenSelect
        isOpen={isOpenCoinModal}
        toggle={toggleCoinModal}
        setCoin={setCoin}
        selectedChainId={chainId}
        isFromAmb={isFromAmb}
      />
      <form className="content exchange" onSubmit={handleTransaction}>
        <h2 className="exchange__heading">Select Network and enter amount</h2>
        <div className="exchange__fields">
          <ExchangeField
            {...{
              networks: isFromAmb ? [AmbrosusNetwork] : networks,
              changeCoin: toggleCoinModal,
              selectedChainId: chainId,
              selectedCoin,
              transactionAmount,
              setTransactionAmount,
              isValueInvalid,
              isFromAmb,
            }}
          />
          <button type="button" onClick={toggleDirection}>
            <img
              src={SwapButton}
              alt="swap button"
              className="exchange__swap-button"
            />
          </button>
          <ExchangeField
            {...{
              networks: isFromAmb ? networks : [AmbrosusNetwork],
              changeCoin: toggleCoinModal,
              selectedChainId: chainId,
              selectedCoin,
              transactionAmount,
              setTransactionAmount,
              isFromAmb,
            }}
            isReceive
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
    </>
  );
};

export default Exchange;
