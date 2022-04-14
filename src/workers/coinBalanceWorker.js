import { utils } from 'ethers';
import providers from '../utils/providers';
import getTokenBalance from '../utils/ethers/getTokenBalance';

// This worker needed to fetch balance for all presented coins
// it works in tandem with "useCoinBalance" hook
// and using sessionStorage for caching

// here we remapping supported networks to format
// [ { address: _string_ , chainId: _string_ , denomination: _number_ }, ... ]
// for all tokens

let tokenList;

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', ({ data: message }) => {
  if (message.type === 'init') {
    console.log('worker initialized');
    tokenList = message.tokenList;
  }
  if (message.type === 'start') {
    console.log('worker started');
    startBalanceMonitoring(message.account);
  }
});

const startBalanceMonitoring = (account) => {
  const fetchAllBalances = () => {
    tokenList.forEach(async (token) => {
      Object.keys(token.addresses).forEach((chainId) => {
        getTokenBalance(
          providers[chainId],
          token.addresses[chainId],
          account,
        ).then((bnBalance) =>
          postBalance(bnBalance, token.addresses[chainId], token.denomination),
        );
      });
    });
  };

  fetchAllBalances();

  Object.values(providers).forEach((provider) => {
    provider.on('block', fetchAllBalances);
  });
};

const postBalance = (bnBalance, address, denomination) => {
  const balanceFormattedString = utils.formatUnits(bnBalance, denomination);

  const balanceFloat = parseFloat(balanceFormattedString);

  postMessage({
    type: 'balance',
    address,
    balance: {
      string: bnBalance.toString(),
      formattedString: balanceFormattedString,
      float: balanceFloat,
    },
  });
};
