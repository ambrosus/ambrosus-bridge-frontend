import providers from '../../utils/providers';
import { getSupportedNetworks, AmbrosusNetwork } from '../../utils/networks';
import getTokenBalance from '../../utils/getTokenBalance';

const supportedNetworks = getSupportedNetworks();

// This worker needed to fetch balance for all presented coins
// it works in tandem with "useCoinBalance" hook
// and using sessionStorage for caching

// here we remapping supported networks to format [ { address: '', chainId: '' }, ... ] for all tokens
const allTokensList = Object.values(supportedNetworks).reduce(
  (acc, network) => {
    // splitting token entity to native network token and ambrosus wrapped token
    const listOfSplittedTokens = network.tokens.reduce((list, token) => {
      const nativeToken = {
        address: token.nativeContractAddress,
        chainId: network.chainId,
      };
      const wrappedAmbToken = {
        address: token.linkedContractAddress,
        chainId: AmbrosusNetwork.chainId,
      };

      return [...list, nativeToken, wrappedAmbToken];
    }, []);

    return [...acc, ...listOfSplittedTokens];
  },
  [],
);

// here we asynchronously getting all balances and posting a message for "useCoinBalance" hook to catch
const fetchAllBalances = () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const token of allTokensList) {
    const provider = providers[token.chainId];
    getTokenBalance(
      provider,
      token.address,
      '0xaeE13A8db3e216A364255EFEbA171ce329100876',
    ).then((balance) => {
      postMessage({
        type: 'balance',
        address: token.address,
        balance: balance.toString(),
      });
    });
  }
};

fetchAllBalances();
