import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const useTokenList = (chainId) =>
  useLiveQuery(
    async () => {
      const tokenList = await db.tokens.where({ chainId }).toArray();
      const nativeCoin = await db.nativeTokens.get({
        chainId,
      });
      return [nativeCoin, ...tokenList];
    },
    [chainId],
    [{}],
  );

export default useTokenList;
