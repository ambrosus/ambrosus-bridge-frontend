import { utils } from 'ethers';
import providers from '../utils/providers';
import { getSupportedNetworks, AmbrosusNetwork } from '../utils/networks';
import getTokenBalance from '../utils/ethers/getTokenBalance';

// This worker needed to fetch balance for all presented coins
// it works in tandem with "useCoinBalance" hook
// and using sessionStorage for caching

// here we remapping supported networks to format
// [ { address: _string_ , chainId: _string_ , denomination: _number_ }, ... ]
// for all tokens

const supportedNetworks = getSupportedNetworks();

const allTokensList = Object.values(supportedNetworks).reduce(
  (acc, network) => {
    // splitting token entity to native network token and ambrosus wrapped token
    const listOfSplittedTokens = network.tokens.reduce((list, token) => {
      const nativeToken = {
        address: token.nativeContractAddress,
        chainId: network.chainId,
        denomination: token.denomination,
      };
      const wrappedAmbToken = {
        address: token.linkedContractAddress,
        chainId: AmbrosusNetwork.chainId,
        denomination: token.denomination,
      };

      return [...list, nativeToken, wrappedAmbToken];
    }, []);

    return [...acc, ...listOfSplittedTokens];
  },
  [],
);

// here we asynchronously getting all balances and sending a message for "useCoinBalance" hook to catch
const fetchAllBalances = (account) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const token of allTokensList) {
    const provider = providers[token.chainId];
    getTokenBalance(provider, token.address, account).then((bnBalance) => {
      const balanceFormattedString = utils.formatUnits(
        bnBalance,
        token.denomination,
      );

      const balanceFloat = parseFloat(balanceFormattedString);

      postMessage({
        type: 'balance',
        address: token.address,
        balance: {
          string: bnBalance.toString(),
          formattedString: balanceFormattedString,
          float: balanceFloat,
        },
      });
    });
  }
};

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', ({ data: { type, account } }) => {
  if (type === 'start') {
    fetchAllBalances(account);

    Object.values(providers).forEach((provider) => {
      provider.on('block', () => fetchAllBalances(account));
    });
  }
});
