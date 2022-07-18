import React from 'react';
import PropTypes from 'prop-types';
import NetworkSelect from './NetworkSelect';
import InlineLoader from '../../components/InlineLoader';
import CurrencyInput from './CurrencyInput';
import formatBalance from '../../utils/helpers/formatBalance';
import TokenSelect from './TokenSelect';
import useModal from '../../hooks/useModal';
import useTokenList from '../../hooks/useTokenList';
import useCoinBalance from '../../hooks/useCoinBalance';
import { ReactComponent as WalletIcon } from '../../assets/svg/wallet.svg';

const ExchangeField = ({
  networks = [{}],
  setChainId = () => {},
  chainId = 0,
  foreignChainId = 0,
  selectedCoin = {},
  transactionAmount = '',
  setTransactionAmount = () => {},
  isValueInvalid = false,
  setCoin = () => {},
  updateFee = () => {},
  setError = () => {},
}) => {
  const [isOpenCoinModal, toggleCoinModal] = useModal();
  const tokenList = useTokenList(chainId);
  const balance = useCoinBalance(selectedCoin.symbol, selectedCoin.chainId);

  return (
    <>
      <TokenSelect
        isOpen={isOpenCoinModal}
        toggle={toggleCoinModal}
        setCoin={setCoin}
        tokenList={tokenList}
      />
      <div className="exchange-field">
        <span className="exchange-field__network-destination">From: </span>

        <NetworkSelect
          networks={networks}
          setChainId={setChainId}
          selectedChainId={chainId}
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

        <CurrencyInput
          value={transactionAmount}
          isValueInvalid={isValueInvalid}
          onChange={setTransactionAmount}
          disabled={false}
          changeCoin={toggleCoinModal}
          selectedCoin={selectedCoin}
          balance={balance}
          onBlur={updateFee}
          setError={setError}
          foreignChainId={foreignChainId}
        />
      </div>
    </>
  );
};

ExchangeField.propTypes = {
  networks: PropTypes.arrayOf(PropTypes.object),
  setChainId: PropTypes.func,
  chainId: PropTypes.number,
  foreignChainId: PropTypes.number,
  transactionAmount: PropTypes.string,
  setTransactionAmount: PropTypes.func,
  selectedCoin: PropTypes.object,
  isValueInvalid: PropTypes.bool,
  setCoin: PropTypes.func,
  updateFee: PropTypes.func,
  setError: PropTypes.func,
};

export default ExchangeField;
