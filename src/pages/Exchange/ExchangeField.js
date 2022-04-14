import React from 'react';
import PropTypes from 'prop-types';
import { useCoinBalance } from '../../hooks/useCoinBalance';
import NetworkSelect from './NetworkSelect';
import InlineLoader from '../../components/InlineLoader';
import CurrencyInput from './CurrencyInput';
import formatBalance from '../../utils/helpers/formatBalance';

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
  const balance = useCoinBalance(selectedCoin.addresses[networks[0].chainId]);

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
            {formatBalance(balance.formattedString)} {selectedCoin.symbol}
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

export default ExchangeField;
