import React from 'react';
import PropTypes from 'prop-types';
import NetworkSelect from './NetworkSelect';
import InlineLoader from '../../components/InlineLoader';
import CurrencyInput from './CurrencyInput';
import formatBalance from '../../utils/helpers/formatBalance';
import TokenSelect from './TokenSelect';
import useModal from '../../hooks/useModal';
import useTokenList from '../../hooks/useTokenList';

const ExchangeField = ({
  networks = [{}],
  setChainId = () => {},
  selectedChainId = 0,
  selectedCoin = {},
  transactionAmount = '',
  setTransactionAmount = () => {},
  isValueInvalid = false,
  setCoin = () => {},
}) => {
  const [isOpenCoinModal, toggleCoinModal] = useModal();
  const tokenList = useTokenList(selectedChainId);

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
          selectedChainId={selectedChainId}
        />

        <div className="exchange-field__balance-container">
          Balance:
          {selectedCoin.balance ? (
            <span className="exchange-field__balance">
              {formatBalance(selectedCoin.balance)} {selectedCoin.symbol}
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
        />
      </div>
    </>
  );
};

ExchangeField.propTypes = {
  networks: PropTypes.arrayOf(PropTypes.object),
  setChainId: PropTypes.func,
  selectedChainId: PropTypes.number,
  transactionAmount: PropTypes.string,
  setTransactionAmount: PropTypes.func,
  selectedCoin: PropTypes.object,
  isValueInvalid: PropTypes.bool,
  setCoin: PropTypes.func,
};

export default ExchangeField;
