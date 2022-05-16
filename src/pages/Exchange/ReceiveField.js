import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NetworkSelect from './NetworkSelect';
import TokenSelect from './TokenSelect';
import useModal from '../../hooks/useModal';
import { db } from '../../db';
import ChevronIcon from '../../assets/svg/chevron.svg';
import { ambChainId, ethChainId } from '../../utils/providers';
import formatBalance from '../../utils/helpers/formatBalance';
import InlineLoader from '../../components/InlineLoader';
import useCoinBalance from '../../hooks/useCoinBalance';
import { ReactComponent as WalletIcon } from '../../assets/svg/wallet.svg';

const ReceiveField = ({
  networks = [{}],
  setChainId = () => {},
  selectedChainId = 0,
  selectedCoin = {},
  receivedCoin = {},
  transactionAmount = '',
  setCoin = () => {},
}) => {
  // const balance = useCoinBalance(selectedCoin.addresses[networks[0].chainId]);
  const [isOpenCoinModal, toggleCoinModal] = useModal();
  const [receiveTokenList, setReceiveTokenList] = useState();
  const receiveChainId =
    selectedChainId === ambChainId ? ethChainId : ambChainId;

  useEffect(async () => {
    const tokenList = [];
    if (
      selectedCoin.primaryNet !== selectedChainId &&
      selectedCoin.nativeAnalog
    ) {
      const nativeCoin = await db.nativeTokens.get({
        symbol: selectedCoin.nativeAnalog,
      });
      const wrappedCoin = await db.tokens.get({
        symbol: selectedCoin.symbol,
        chainId: receiveChainId,
      });
      tokenList.push(wrappedCoin, nativeCoin);
    } else if (selectedCoin.wrappedAnalog) {
      const wrappedCoin = await db.tokens.get({
        symbol: selectedCoin.wrappedAnalog,
      });
      tokenList.push(wrappedCoin);
    } else if (
      selectedCoin.primaryNet === selectedChainId &&
      selectedCoin.nativeAnalog
    ) {
      const wrappedCoin = await db.tokens.get({
        symbol: selectedCoin.symbol,
        chainId: receiveChainId,
      });
      tokenList.push(wrappedCoin);
    }
    setReceiveTokenList(tokenList);
    setCoin(tokenList[0]);
  }, [selectedCoin]);

  const balance = useCoinBalance(receivedCoin.symbol, receivedCoin.chainId);

  return (
    <>
      <TokenSelect
        isOpen={isOpenCoinModal}
        toggle={toggleCoinModal}
        setCoin={setCoin}
        tokenList={receiveTokenList}
      />
      <div className="exchange-field">
        <span className="exchange-field__network-destination">To: </span>

        <NetworkSelect
          networks={networks}
          setChainId={setChainId}
          selectedChainId={selectedChainId}
        />

        <div className="exchange-field__balance-container">
          <span className="exchange-field__balance-placeholder">Balance:</span>
          <WalletIcon className="exchange-field__wallet-icon" />
          {balance ? (
            <span className="exchange-field__balance">
              {formatBalance(balance)} {selectedCoin.symbol}
            </span>
          ) : (
            <InlineLoader />
          )}
        </div>

        <div
          className={`currency-input ${
            transactionAmount.length > 12 ? 'currency-input_too-long' : ''
          }`}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="currency-input__label">Receive:</label>
          <input
            type="string"
            placeholder="0.0"
            value={transactionAmount}
            className="currency-input__input"
            readOnly
          />
          <button
            type="button"
            className="currency-input__coin-button"
            onClick={toggleCoinModal}
          >
            <img
              src={receivedCoin.logo}
              alt="#"
              className="currency-input__currency-icon"
            />
            {receivedCoin.symbol}
            <img
              src={ChevronIcon}
              alt="chevron icon"
              className="currency-input__chevron-icon"
            />
          </button>
        </div>
      </div>
    </>
  );
};

ReceiveField.propTypes = {
  networks: PropTypes.arrayOf(PropTypes.object),
  setChainId: PropTypes.func,
  selectedChainId: PropTypes.number,
  transactionAmount: PropTypes.string,
  selectedCoin: PropTypes.object,
  receivedCoin: PropTypes.object,
  setCoin: PropTypes.func,
};

export default ReceiveField;
