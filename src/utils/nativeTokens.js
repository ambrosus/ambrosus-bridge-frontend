import { ambChainId, ethChainId } from './providers';

const AMB = {
  name: 'Amber',
  symbol: 'AMB',
  logo: 'https://media-exp1.licdn.com/dms/image/C560BAQFuR2Fncbgbtg/company-logo_200_200/0/1636390910839?e=2159024400&v=beta&t=W0WA5w02tIEH859mVypmzB_FPn29tS5JqTEYr4EYvps',
  denomination: 18,
  chainId: ambChainId,
  wrappedAnalog: 'SAMB',
  balance: '',
};

const ETH = {
  name: 'Ethereum',
  symbol: 'ETH',
  logo: 'https://ethereum.org/static/bfc04ac72981166c740b189463e1f74c/448ee/eth-diamond-black-white.webp',
  denomination: 18,
  chainId: ethChainId,
  wrappedAnalog: 'WETH',
  balance: '',
};

export const nativeTokensById = {
  [ambChainId]: AMB,
  [ethChainId]: ETH,
};
