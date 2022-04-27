import providers, { ambChainId, ethChainId } from '../utils/providers';
import getTokenBalance from '../utils/ethers/getTokenBalance';
import { db } from '../db';

// This worker needed to fetch balance for all presented coins
// it works in tandem with "useCoinBalance" hook
// and using sessionStorage for caching

// here we remapping supported networks to format
// [ { address: _string_ , chainId: _string_ , denomination: _number_ }, ... ]
// for all tokens

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', ({ data: message }) => {
  let isActive = false;
  if (message.type === 'start') {
    if (!isActive) {
      console.log('worker started');
      startBalanceMonitoring(message.account);
      isActive = true;
    }
  }
});

const startBalanceMonitoring = async (account) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const chainId of [ambChainId, ethChainId]) {
    fetchBalancesOfNetwork(account, chainId);
    // providers[chainId].on('block', () =>
    //   fetchBalancesOfNetwork(account, chainId),
    // );
  }
};

const fetchBalancesOfNetwork = async (account, chainId) => {
  const tokens = await db.tokens.where({ chainId }).toArray();
  // eslint-disable-next-line no-restricted-syntax
  for (const token of tokens) {
    getTokenBalance(providers[chainId], token.address, account).then(
      (balance) => {
        db.tokens.put({ ...token, balance: balance.toString() });
      },
    );
  }

  const nativeToken = await db.nativeTokens.get({ chainId });
  providers[chainId].getBalance(account).then((balance) => {
    db.nativeTokens.put({
      ...nativeToken,
      balance: balance.toString(),
    });
  });
};

// const postBalance = (bnBalance, token) => {
//   const balanceFormattedString = utils.formatUnits(
//       bnBalance,
//       token.denomination,
//   );
//
//   const balanceFloat = parseFloat(balanceFormattedString);
//
//   postMessage({
//     type: 'balance',
//     address: token.address || token.chainId,
//     balance: {
//       string: bnBalance.toString(),
//       formattedString: balanceFormattedString,
//       float: balanceFloat,
//     },
//   });
// };

// const fetchAllBalances = () => {
//   tokenList.forEach(async (token) => {
//     Object.keys(token.addresses).forEach((chainId) => {
//       getTokenBalance(
//         providers[chainId],
//         token.addresses[chainId],
//         account,
//       ).then((bnBalance) =>
//         postBalance(
//           bnBalance,
//           token.addresses[chainId],
//           token.denomination,
//           chainId,
//         ),
//       );
//     });
//   });
// };
//
// fetchAllBalances();
//
// Object.values(providers).forEach((provider) => {
//   provider.on('block', fetchAllBalances);
// });
