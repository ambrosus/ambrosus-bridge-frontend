import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { utils } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
import CurrencyInput from '../components/CurrencyInput';
import SwapButton from '../assets/svg/exchange__swap-button.svg';
import NetworkSelect from '../components/NetworkSelect';
import TokenSelect from '../components/TokenSelect';
import { AmbrosusNetwork, getSupportedNetworks } from '../utils/networks';
import useModal from '../hooks/useModal';
import InlineLoader from '../components/InlineLoader';
import { useCoinBalance } from '../hooks/useCoinBalance/useCoinBalance';
import createBridgeContract from '../contracts';
import getTokenBalance from '../utils/getTokenBalance';
import { changeChainId } from '../utils/web3';

const Exchange = () => {
  const [networks, setNetworks] = useState(undefined);

  const [isFromAmb, setIsFromAmb] = useState(false);
  const toggleDirection = () => setIsFromAmb(!isFromAmb);

  const [selectedChainId, setChainId] = useState(undefined);
  const [selectedCoin, setCoin] = useState({});

  const [transactionAmount, setTransactionAmount] = useState('0.0');

  const [isOpenCoinModal, toggleCoinModal] = useModal();

  const { library, account } = useWeb3React();
  const [transferFee, setTransferFee] = useState(null);

  const [isValueInvalid, setIsInvalid] = useState(false);

  useEffect(async () => {
    const supportedNetworks = getSupportedNetworks();

    setNetworks(supportedNetworks);
    setChainId(supportedNetworks[0].chainId);
    setCoin(supportedNetworks[0].tokens[0]);

    const BridgeContract =
      createBridgeContract[supportedNetworks[0].chainId](library);

    const fee = await BridgeContract.callStatic.fee();
    setTransferFee(utils.formatEther(fee));
  }, []);

  useEffect(async () => {
    if (selectedChainId) {
      const selectedNetwork = networks.find(
        (network) => network.chainId === selectedChainId,
      );

      setCoin(selectedNetwork.tokens[0]);

      await changeChainId(library.provider, selectedNetwork);
    }
  }, [selectedChainId]);

  useEffect(() => {
    setTransactionAmount('0.0');
  }, [selectedCoin]);

  useEffect(() => {
    setIsInvalid(false);
  }, [transactionAmount, selectedCoin, selectedChainId]);

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
    }

    if (bnValue.gt(actualBnBalance)) isInvalid = true;
    if (bnValue.isZero()) isInvalid = true;

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
            }}
            isReceive
          />
        </div>
        <div className="exchange__estimated-fee-container">
          Transfer fee:
          <span className="exchange__estimated-fee">
            {transferFee || <InlineLoader />} ETH
          </span>
        </div>
        <button type="submit" className="button button_black exchange__button">
          Transfer
        </button>
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
  transactionAmount = '0.0',
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
            {balance.formattedString} {selectedCoin.code}
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
