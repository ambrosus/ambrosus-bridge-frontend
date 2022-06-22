import Dexie from 'dexie';

export const db = new Dexie('primary');

db.version(2).stores({
  tokens: '[symbol+chainId], chainId, nativeAnalog',
  nativeTokens: 'symbol, [symbol+chainId], wrappedAnalog, chainId',
});
