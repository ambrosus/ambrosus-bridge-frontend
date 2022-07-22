import { ambChainId, bscChainId, ethChainId } from './providers';

const AMB = {
  name: 'Amber',
  symbol: 'AMB',
  denomination: 18,
  chainId: ambChainId,
  wrappedAnalog: 'testSAMB',
  balance: '',
};

const ETH = {
  name: 'Ethereum',
  symbol: 'ETH',
  denomination: 18,
  chainId: ethChainId,
  wrappedAnalog: 'WETH',
  balance: '',
};

const BNB = {
  name: 'BNB',
  symbol: 'BNB',
  denomination: 18,
  chainId: bscChainId,
  wrappedAnalog: 'WBNB',
  balance: '',
};

export const nativeTokensById = {
  [ambChainId]: AMB,
  [ethChainId]: ETH,
  [bscChainId]: BNB,
};
