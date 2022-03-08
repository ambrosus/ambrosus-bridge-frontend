import { useEffect, useState } from 'react';
import { getSupportedNetworks } from '../utils/networks';
import { useSubscribeOnBalanceUpdate } from './useCoinBalance/useCoinBalance';

const useTokenList = (chainId) => {
  const [tokenList, setTokenList] = useState([]);

  useEffect(() => {
    const supportedNetworks = getSupportedNetworks();
    const currentNetwork = chainId
      ? supportedNetworks.find((network) => network.chainId === chainId)
      : supportedNetworks[0];

    const tokenListWithBalances = currentNetwork.tokens.map((token) => {
      const cachedBalance = sessionStorage.getItem(token.nativeContractAddress);

      const withBalance = cachedBalance && parseInt(cachedBalance, 10) > 0;
      return { ...token, withBalance };
    });

    setTokenList(tokenListWithBalances);
  }, [chainId]);

  useSubscribeOnBalanceUpdate(() => {
    if (tokenList.length) {
      const tokenListWithBalances = tokenList.map((token) => {
        const cachedBalance = sessionStorage.getItem(
          token.nativeContractAddress,
        );

        const withBalance = cachedBalance && parseInt(cachedBalance, 10) > 0;
        return { ...token, withBalance };
      });

      setTokenList(tokenListWithBalances);
    }
  });

  return tokenList;
};

export default useTokenList;
