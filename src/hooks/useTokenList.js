import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const useTokenList = (chainId) => {
  const [tokenListWithNativeCoin, setTokenListWithNativeCoin] = useState([{}]);

  useLiveQuery(async () => {
    const tokenList = await db.tokens.where({ chainId }).toArray();
    const nativeCoin = await db.nativeTokens.get({
      chainId,
    });
    setTokenListWithNativeCoin([nativeCoin, ...tokenList]);
  }, [chainId]);

  return tokenListWithNativeCoin;
};

export default useTokenList;
