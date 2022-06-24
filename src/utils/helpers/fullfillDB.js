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
      balance: '',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      denomination: 18,
      chainId: allNetworks.eth.chainId,
      wrappedAnalog: 'WETH',
      balance: '',
    },
    {
      name: 'Binance Coin',
      symbol: 'BNB',
      denomination: 18,
      chainId: allNetworks.bsc.chainId,
      wrappedAnalog: 'WBNB',
      balance: '',
    },
  ]);
};

export default fulfillDB;
