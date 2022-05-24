import Dexie from 'dexie';
import ConfigMock from './bridge-config.mock.json';
import { ambChainId, ethChainId } from './utils/providers';

const networkChainIds = {
  amb: ambChainId,
  eth: ethChainId,
};

export const db = new Dexie('primary');
db.version(2).stores({
  tokens: '[symbol+chainId], chainId, nativeAnalog',
  nativeTokens: 'symbol, [symbol+chainId], wrappedAnalog, chainId',
});

const tokenList = Object.values(ConfigMock.tokens).reduce((list, token) => {
  const ambTokenEntity = {
    name: token.name,
    symbol: token.symbol,
    logo: token.logo,
    denomination: token.denomination,
    chainId: ambChainId,
    nativeAnalog: token.nativeAnalog,
    address: token.addresses.amb,
    primaryNet: networkChainIds[token.primaryNet],
  };
  const ethTokenEntity = {
    name: token.name,
    symbol: token.symbol,
    logo: token.logo,
    denomination: token.denomination,
    chainId: ethChainId,
    nativeAnalog: token.nativeAnalog,
    address: token.addresses.eth,
    primaryNet: networkChainIds[token.primaryNet],
  };

  return [...list, ambTokenEntity, ethTokenEntity];
}, []);

db.tokens.bulkPut(tokenList);
db.nativeTokens.bulkPut([
  {
    name: 'Amber',
    symbol: 'AMB',
    logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
    denomination: 18,
    chainId: ambChainId,
    wrappedAnalog: 'SAMB',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://ethereum.org/static/bfc04ac72981166c740b189463e1f74c/448ee/eth-diamond-black-white.webp',
    denomination: 18,
    chainId: ethChainId,
    wrappedAnalog: 'WETH',
  },
]);
