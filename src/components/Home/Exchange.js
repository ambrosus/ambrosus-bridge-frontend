import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import CurrencyInput from '../CurrencyInput';
import SwapButton from '../../assets/svg/exchange__swap-button.svg';
import NetworkSelect from '../NetworkSelect';
import TokenSelect from '../TokenSelect';
import { AmbrosusNetwork, getSupportedNetworks } from '../../utils/networks';
import useModal from '../../hooks/useModal';
import InlineLoader from '../InlineLoader';
import useCoinBalance from '../../hooks/useCoinBalance/useCoinBalance';
import ErrorContext from '../../contexts/ErrorContext';

const Exchange = () => {
  const history = useHistory();
  const web3 = useWeb3React();

  const { setError } = useContext(ErrorContext);

  useEffect(() => {
    if (web3.error instanceof UnsupportedChainIdError) {
      setError(
        'Unsupported network. Please connect to a supported network in the dropdown menu or in your wallet.',
      );
    } else {
      setError(null);
    }
  }, [web3]);

  const handleTransferButton = () => {
    history.push('/confirm');
  };

  // networks with tokens
  const [{ sender, receiver }, setFieldsData] = useState({
    sender: {
      networks: [{}],
    },
    receiver: {
      networks: [{}],
    },
  });

  const [selectedChainId, setChainId] = useState(undefined);

  const swapSenderAndReceiver = () => {
    setFieldsData({
      sender: receiver,
      receiver: sender,
    });
  };

  const [selectedCoin, setCoin] = useState({});
  const [transactionAmount, setTransactionAmount] = useState(undefined);
  const [isOpenCoinModal, toggleCoinModal] = useModal();

  useEffect(() => {
    const supportedNetworks = getSupportedNetworks();

    setFieldsData({
      sender: {
        networks: supportedNetworks,
      },
      receiver: {
        networks: [AmbrosusNetwork],
      },
    });

    setChainId(supportedNetworks[0].chainId);
    setCoin(supportedNetworks[0].tokens[0]);
  }, []);

  useEffect(() => {
    if (selectedChainId) {
      const supportedNetworks = getSupportedNetworks();
      const selectedNetwork = supportedNetworks.find(
        (network) => network.chainId === selectedChainId,
      );

      setCoin(selectedNetwork.tokens[0]);
    }
  }, [selectedChainId]);

  useEffect(() => {
    setTransactionAmount(0);
  }, [selectedCoin]);

  return (
    <>
      <TokenSelect
        isOpen={isOpenCoinModal}
        toggle={toggleCoinModal}
        setCoin={setCoin}
        selectedChainId={selectedChainId}
      />
      <div className="content exchange">
        <h2 className="exchange__heading">Select Network and enter amount</h2>
        <div className="exchange__fields">
          <ExchangeField
            networks={sender.networks}
            selectedChainId={selectedChainId}
            changeCoin={toggleCoinModal}
            selectedCoin={selectedCoin}
            setChainId={setChainId}
            transactionAmount={transactionAmount}
            setTransactionAmount={setTransactionAmount}
          />
          <button type="button" onClick={swapSenderAndReceiver}>
            <img
              src={SwapButton}
              alt="swap button"
              className="exchange__swap-button"
            />
          </button>
          <ExchangeField
            networks={receiver.networks}
            selectedChainId={selectedChainId}
            selectedCoin={selectedCoin}
            changeCoin={toggleCoinModal}
            setChainId={setChainId}
            transactionAmount={transactionAmount}
            setTransactionAmount={setTransactionAmount}
            isReceive
          />
        </div>
        <div className="exchange__estimated-fee-container">
          Estimated transfer fee:
          <span className="exchange__estimated-fee">0.08 ETH.AM</span>
        </div>
        <button
          onClick={handleTransferButton}
          type="button"
          className="button button_black exchange__button"
        >
          Transfer
        </button>
      </div>
    </>
  );
};

export default Exchange;

const ExchangeField = ({
  isReceive = false,
  networks = [{}],
  setChainId = () => {},
  selectedChainId = 0,
  selectedCoin = {},
  transactionAmount = undefined,
  setTransactionAmount = () => {},
  changeCoin = () => {},
}) => {
  const balance = useCoinBalance(selectedCoin.nativeContractAddress);

  return (
    <div className="exchange-field">
      <span className="exchange-field__network-destination">
        {isReceive ? 'To: ' : 'From: '}
      </span>

      <NetworkSelect
        networks={networks}
        setChainId={setChainId}
        selectedChainId={selectedChainId}
      />

      <div className="exchange-field__balance-container">
        Balance:
        {balance ? (
          <span className="exchange-field__balance">{balance} ETH.AM</span>
        ) : (
          <InlineLoader />
        )}
      </div>

      <CurrencyInput
        value={transactionAmount}
        onChange={setTransactionAmount}
        disabled={isReceive}
        changeCoin={changeCoin}
        selectedCoin={selectedCoin}
      />
    </div>
  );
};

ExchangeField.propTypes = {
  isReceive: PropTypes.bool,
  networks: PropTypes.arrayOf(PropTypes.object),
  setChainId: PropTypes.func,
  selectedChainId: PropTypes.number,
  transactionAmount: PropTypes.number,
  setTransactionAmount: PropTypes.func,
  changeCoin: PropTypes.func,
  selectedCoin: PropTypes.object,
};
