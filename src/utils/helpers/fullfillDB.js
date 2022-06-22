import { allNetworks } from '../networks';
import { db } from '../../db';

const fulfillDB = (tokenList) => {
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
    {
      name: 'Binance Coin',
      symbol: 'BNB',
      denomination: 18,
      chainId: allNetworks.bsc.chainId,
      wrappedAnalog: 'WBNB',
    },
  ]);
};

export default fulfillDB;
