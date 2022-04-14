import React, { useContext, useEffect, useState } from 'react';
import TokenListContext from './context';
import ConfigMock from '../../bridge-config.mock.json';
import CoinBalanceWorkerContext from '../CoinBalanceWorkerContext/context';
import { ambChainId, ethChainId } from '../../utils/providers';

const TokenListContextProvider = (props) => {
  const [tokenList, setTokenList] = useState();
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
    formattedTokenList.unshift({
      name: 'Amber',
      symbol: 'AMB',
      logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
      denomination: 18,
      primaryNet: 'amb',
      isNativeCoin: true,
      addresses: {
        [ambChainId]: '',
        [ethChainId]: '0xD45698dA44D8Dda5c80911617FA57fd5e39099c4',
      },
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
