import { useEffect, useState } from 'react';
import { getAllNetworks } from '../utils/networks';
import { useSubscribeOnBalanceUpdate } from './useCoinBalance';
import getCachedCoinBalance from '../utils/helpers/getCachedCoinBalance';

const useTokenList = (chainId) => {
  const [tokenList, setTokenList] = useState([]);

  useEffect(() => {
    const supportedNetworks = getAllNetworks();
    const currentNetwork = chainId
      ? supportedNetworks.find((network) => network.chainId === chainId)
      : supportedNetworks[0];

    const tokenListWithBalances = currentNetwork.tokens.map(
      addWithBalancePropertyToList,
    );

    setTokenList(tokenListWithBalances);
  }, [chainId]);

  useSubscribeOnBalanceUpdate(() => {
    if (tokenList.length) {
      const tokenListWithBalances = tokenList.map(addWithBalancePropertyToList);
      setTokenList(tokenListWithBalances);
    }
  });

  return tokenList;
};

const addWithBalancePropertyToList = (token) => {
  const cachedBalance = getCachedCoinBalance(token.nativeContractAddress);
  const withBalance = cachedBalance.float > 0;
  return { ...token, withBalance };
};

export default useTokenList;
