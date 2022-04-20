import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

const useCoinBalance = (symbol, chainId) =>
  useLiveQuery(
    async () => {
      if (symbol && chainId) {
        try {
          const { balance } = await db.tokens.get({ symbol, chainId });
          return balance || '';
        } catch (e) {
          const { balance } = await db.nativeTokens.get({ symbol, chainId });
          return balance || '';
        }
      }
      return '';
    },
    [symbol, chainId],
    '',
  );

export default useCoinBalance;
