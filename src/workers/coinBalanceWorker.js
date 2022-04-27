import providers, { ambChainId, ethChainId } from '../utils/providers';
import getTokenBalance from '../utils/ethers/getTokenBalance';
import { db } from '../db';

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', ({ data: message }) => {
  if (message.type === 'start') {
    console.log('worker started');
    startBalanceMonitoring(message.account);
  }
  if (message.type === 'stop') {
    console.log('worker stopped');
    stopBalanceMonitoring(message.account);
  }
});

const startBalanceMonitoring = async (account) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const chainId of [ambChainId, ethChainId]) {
    fetchBalancesOfNetwork(account, chainId);
    providers[chainId].on('block', () =>
      fetchBalancesOfNetwork(account, chainId),
    );
  }
};

const stopBalanceMonitoring = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const chainId of [ambChainId, ethChainId]) {
    providers[chainId].off('block');
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
