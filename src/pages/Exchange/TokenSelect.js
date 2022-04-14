import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MagnifyingGlassIcon from '../../assets/svg/magnifying-glass.svg';
import CrossIcon from '../../assets/svg/cross.svg';
import InlineLoader from '../../components/InlineLoader';
import { useCoinBalance } from '../../hooks/useCoinBalance';
import TokenListContext from '../../contexts/TokenListContext/context';

const TokenSelect = ({
  isOpen = false,
  toggle = () => {},
  setCoin = () => {},
  selectedChainId,
}) => {
  const tokenList = useContext(TokenListContext);
  const [sortedTokenList, setSortedTokenList] = useState([]);

  // lock scrolling of entire page if modal is open
  useEffect(() => {
    if (isOpen) document.querySelector('body').style.overflow = 'hidden';
    else document.querySelector('body').style.overflow = '';
  }, [isOpen]);

  const [searchString, setSearchString] = useState('');

  const filterListBySearch = (token = { name: '', symbol: '' }) => {
    const [ss, name, symbol] = [searchString, token.name, token.symbol].map(
      (str) => str.toLowerCase(),
    );
    return name.startsWith(ss) || symbol.startsWith(ss);
  };

  const sortListByBalance = (token) => (token.withBalance ? -1 : 1);

  useEffect(() => {
    let sorted;
    if (searchString) {
      sorted = tokenList.filter(filterListBySearch);
    } else {
      sorted = [...tokenList].sort(sortListByBalance);
    }
    setSortedTokenList(sorted);
  }, [tokenList, searchString]);

  return !isOpen
    ? null
    : ReactDOM.createPortal(
        <>
          <div aria-hidden className="screen-overlay" onClick={toggle} />
          <div className="content token-select">
            <h3 className="token-select__heading">Select a token</h3>
            <img
              aria-hidden
              src={CrossIcon}
              alt="#"
              className="token-select__cross"
              onClick={toggle}
            />
            <SearchInput onChange={setSearchString} value={searchString} />
            <div className="token-select__token-list">
              {sortedTokenList.map((token) => (
                <TokenButton
                  key={token.symbol}
                  {...{
                    token,
                    toggle,
                    setCoin,
                  }}
                  address={token.addresses[selectedChainId]}
                />
              ))}
            </div>
          </div>
        </>,
        document.getElementById('modal'),
      );
};

TokenSelect.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  tokenList: PropTypes.arrayOf(PropTypes.object),
  setCoin: PropTypes.func,
  isFromAmb: PropTypes.bool,
};

export default TokenSelect;

const SearchInput = ({ value = '', onChange = () => {} }) => {
  const handleInput = (e) => {
    onChange(e.target.value);
  };
  return (
    <label htmlFor="token-search" className="search-field">
      <img
        src={MagnifyingGlassIcon}
        alt="magnifying glass icon"
        className="search-field__icon"
      />
      <input
        type="text"
        className="search-field__input"
        placeholder="Search coin"
        id="token-search"
        value={value}
        onChange={handleInput}
      />
    </label>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const TokenButton = ({ token, setCoin, toggle, address }) => {
  const balance = useCoinBalance(address);
  return (
    <button
      type="button"
      onClick={() => {
        setCoin(token);
        toggle();
      }}
      className="token-select__token"
    >
      <img src={token.logo} alt="#" className="token-select__token-icon" />
      <span className="token-select__token-shorthand">{token.symbol}</span>
      <span className="token-select__token-name">{token.name}</span>
      {balance.formattedString ? (
        <span className="token-select__token-balance">
          {balance.formattedString} {token.symbol}
        </span>
      ) : (
        <InlineLoader />
      )}
    </button>
  );
};

TokenButton.propTypes = {
  token: PropTypes.object,
  setCoin: PropTypes.func,
  toggle: PropTypes.func,
  address: PropTypes.string,
};