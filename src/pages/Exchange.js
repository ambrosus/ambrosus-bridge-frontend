import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { utils } from 'ethers';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
import CurrencyInput from '../components/CurrencyInput';
import SwapButton from '../assets/svg/exchange__swap-button.svg';
import NetworkSelect from '../components/NetworkSelect';
import TokenSelect from '../components/TokenSelect';
import {
  AmbrosusNetwork,
  getNetworkByChainId,
  getSupportedNetworks,
} from '../utils/networks';
import useModal from '../hooks/useModal';
import InlineLoader from '../components/InlineLoader';
import { useCoinBalance } from '../hooks/useCoinBalance/useCoinBalance';
import createBridgeContract from '../contracts';
import getTokenBalance from '../utils/getTokenBalance';
import changeChainId from '../utils/changeChainId';
import ErrorContext from '../contexts/ErrorContext';
import CoinBalanceWorkerContext from '../contexts/CoinBalanceWorkerContext';

const Exchange = () => {
  const { setError } = useContext(ErrorContext);
  const [networks, setNetworks] = useState(undefined);

  const [isFromAmb, setIsFromAmb] = useState(false);
  const toggleDirection = () => setIsFromAmb(!isFromAmb);

  const [selectedChainId, setChainId] = useState(undefined);
  const [selectedCoin, setCoin] = useState({});

  const [transactionAmount, setTransactionAmount] = useState('');

  const [isOpenCoinModal, toggleCoinModal] = useModal();

  const { library, account, chainId } = useWeb3React();
  const [transferFee, setTransferFee] = useState(null);

  const [isValueInvalid, setIsInvalid] = useState(false);

  const worker = useContext(CoinBalanceWorkerContext);

  // setting init values
  useEffect(async () => {
    const supportedNetworks = getSupportedNetworks();

    setNetworks(supportedNetworks);
    setChainId(supportedNetworks[0].chainId);
    setCoin(supportedNetworks[0].tokens[0]);

    worker.postMessage({ type: 'start', account });
  }, []);

  // if network changed, set first token presented in list
  // (actually useless until bsc integration)
  useEffect(() => {
    if (selectedChainId) {
      const selectedNetwork = getNetworkByChainId(selectedChainId);
      setCoin(selectedNetwork.tokens[0]);
    }
  }, [selectedChainId]);

  // switch network in wallet, if switched network in interface
  // get transfer fee for new selected network
  useEffect(async () => {
    if (selectedChainId) {
      let chainIdToSwitch;
      if (isFromAmb) {
        chainIdToSwitch = AmbrosusNetwork.chainId;
      } else {
        chainIdToSwitch = selectedChainId;
      }

      await changeChainId(library.provider, chainIdToSwitch);

      const BridgeContract = createBridgeContract[chainIdToSwitch](library);

      const fee = await BridgeContract.callStatic.fee();
      setTransferFee(utils.formatEther(fee));
    }
  }, [selectedChainId, isFromAmb]);

  // reset value if coin changed
  useEffect(() => {
    setTransactionAmount('');
  }, [selectedCoin]);

  // remove error on any change until new form submission
  useEffect(() => {
    setError(null);
    setIsInvalid(false);
  }, [transactionAmount, selectedCoin, selectedChainId]);

  // set chainId in interface if it was changed in wallet
  // (unsupported chainId's handled in routing in Main.js)
  useEffect(() => {
    if (chainId === AmbrosusNetwork.chainId) {
      setIsFromAmb(true);
    } else {
      setIsFromAmb(false);
      setChainId(chainId);
    }
  }, [chainId]);

  const history = useHistory();

  const handleTransaction = async (e) => {
    e.preventDefault();
    const tokenAddress = isFromAmb
      ? selectedCoin.linkedContractAddress
      : selectedCoin.nativeContractAddress;

    let isInvalid = false;
    const actualBnBalance = await getTokenBalance(
      library,
      tokenAddress,
      account,
    );

    let bnValue;
    try {
      bnValue = utils.parseUnits(transactionAmount, selectedCoin.denomination);
    } catch (parseError) {
      isInvalid = true;
      setError('Invalid value');
    }

    if (bnValue.gt(actualBnBalance)) {
      isInvalid = true;
      setError('Not enough coins on balance');
    }
    if (bnValue.isZero()) {
      isInvalid = true;
      setError('Your value is zero');
    }

    if (isInvalid) {
      setIsInvalid(isInvalid);
    } else {
      history.push({
        pathname: '/confirm',
        state: {
          selectedChainId,
          selectedCoin,
          isFromAmb,
          transactionAmount,
        },
      });
    }
  };

  return (
    <>
      <TokenSelect
        isOpen={isOpenCoinModal}
        toggle={toggleCoinModal}
        setCoin={setCoin}
        selectedChainId={selectedChainId}
        isFromAmb={isFromAmb}
      />
      <form className="content exchange" onSubmit={handleTransaction}>
        <h2 className="exchange__heading">Select Network and enter amount</h2>
        <div className="exchange__fields">
          <ExchangeField
            {...{
              networks: isFromAmb ? [AmbrosusNetwork] : networks,
              changeCoin: toggleCoinModal,
              selectedChainId,
              selectedCoin,
              setChainId,
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
              selectedChainId,
              selectedCoin,
              setChainId,
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

const ExchangeField = ({
  isReceive = false,
  networks = [{}],
  setChainId = () => {},
  selectedChainId = 0,
  selectedCoin = {},
  transactionAmount = '',
  setTransactionAmount = () => {},
  changeCoin = () => {},
  isValueInvalid = false,
}) => {
  const balance = useCoinBalance(
    networks[0] === AmbrosusNetwork
      ? selectedCoin.linkedContractAddress
      : selectedCoin.nativeContractAddress,
  );

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
        {balance.formattedString ? (
          <span className="exchange-field__balance">
            {sliceBalance(balance.formattedString)} {selectedCoin.code}
          </span>
        ) : (
          <InlineLoader />
        )}
      </div>

      <CurrencyInput
        value={transactionAmount}
        isValueInvalid={isValueInvalid}
        onChange={setTransactionAmount}
        disabled={isReceive}
        changeCoin={changeCoin}
        selectedCoin={selectedCoin}
        balance={balance}
        minValue={0.0001}
      />
    </div>
  );
};

ExchangeField.propTypes = {
  isReceive: PropTypes.bool,
  networks: PropTypes.arrayOf(PropTypes.object),
  setChainId: PropTypes.func,
  selectedChainId: PropTypes.number,
  transactionAmount: PropTypes.string,
  setTransactionAmount: PropTypes.func,
  changeCoin: PropTypes.func,
  selectedCoin: PropTypes.object,
  isValueInvalid: PropTypes.bool,
};

const sliceBalance = (balance) => {
  const [intPart, floatPart] = balance.split('.');
  let formattedBalance;
  if (floatPart && floatPart.length > 6) {
    formattedBalance = `${intPart}.${floatPart.slice(0, 6)}…`;
  } else if (floatPart) {
    formattedBalance = `${intPart}.${floatPart}`;
  } else {
    formattedBalance = intPart;
  }
  return formattedBalance;
};
