import Dexie from 'dexie';
import ConfigMock from './bridge-config.mock.json';
import formatTokenListFromConfig from './utils/formatTokenListFromConfig';
import { allNetworks } from './utils/networks';

const fulfillDB = async () => {
  const tokenList = await fetch(process.env.REACT_APP_CONFIG_URL)
    .then((res) => (res.status <= 400 ? res.json() : ConfigMock))
    .then(({ tokens }) => formatTokenListFromConfig(tokens));

  db.tokens.bulkPut(tokenList);
  db.nativeTokens.bulkPut([
    {
      name: 'Amber',
      symbol: 'AMB',
      denomination: 18,
      chainId: allNetworks.amb.chainId,
      wrappedAnalog: 'SAMB',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      denomination: 18,
      chainId: allNetworks.eth.chainId,
      wrappedAnalog: 'WETH',
    },
  ]);
};

export const db = new Dexie('primary');

db.version(2).stores({
  tokens: '[symbol+chainId], chainId, nativeAnalog',
  nativeTokens: 'symbol, [symbol+chainId], wrappedAnalog, chainId',
});

fulfillDB();
