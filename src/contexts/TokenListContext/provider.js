import React, { useContext, useEffect, useState } from 'react';
import TokenListContext from './context';
import ConfigMock from '../../bridge-config.mock.json';
import CoinBalanceWorkerContext from '../CoinBalanceWorkerContext/context';
import { ambChainId, ethChainId } from '../../utils/providers';

const TokenListContextProvider = (props) => {
  const [tokenList, setTokenList] = useState([]);
  const worker = useContext(CoinBalanceWorkerContext);

  useEffect(() => {
    const rawTokenList = ConfigMock.tokens;
    const formattedTokenList = Object.values(rawTokenList).map((token) => {
      const addresses = {
        [ambChainId]: token.addresses.amb,
        [ethChainId]: token.addresses.eth,
      };
      return { ...token, addresses };
    });
    setTokenList(formattedTokenList);
  }, []);

  useEffect(() => {
    if (worker && tokenList) {
      worker.postMessage({ type: 'init', tokenList });
    }
  }, [worker, tokenList]);

  return <TokenListContext.Provider value={tokenList} {...props} />;
};

export default TokenListContextProvider;
