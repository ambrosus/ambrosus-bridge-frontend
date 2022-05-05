import { ethers } from 'ethers';
import { db } from '../db';
import providers, { ambChainId, ethChainId } from '../utils/providers';
import CustomJsonRpcBatchProvider from '../utils/ethers/CustomJsonRpcBatchProvider';

const ethProvider = new CustomJsonRpcBatchProvider(
  process.env.REACT_APP_ETH_RPC_URL + process.env.REACT_APP_INFURA_KEY,
  +process.env.REACT_APP_ETH_CHAIN_ID,
);

const ambProvider = new CustomJsonRpcBatchProvider(
  process.env.REACT_APP_AMB_RPC_URL,
  +process.env.REACT_APP_AMB_CHAIN_ID,
);

const batchProviders = {
  [ethChainId]: ethProvider,
  [ambChainId]: ambProvider,
};

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
  for (const chainId of [ethChainId, ambChainId]) {
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
  const nativeToken = await db.nativeTokens.get({ chainId });

  const callList = await Promise.allSettled([
    ...tokens.map((token) =>
      encodeGetErc20BalanceData(
        token.address,
        account,
        batchProviders[chainId],
      ).then((txData) => ({
        token,
        callData: ['eth_call', [txData, 'latest']],
      })),
    ),
    {
      token: nativeToken,
      callData: ['eth_getBalance', [account, 'latest']],
    },
  ]);

  const pendingBalancesList = callList.map((call) => {
    const promise = batchProviders[chainId].pushToBatch(...call.value.callData);
    return {
      token: call.value.token,
      promise,
    };
  });

  // tokens.map(async (token) =>
  //   encodeGetErc20BalanceData(token.address, account, batchProviders[chainId])
  //     .then((txData) =>
  //       batchProviders[chainId].pushToBatch('eth_call', [txData, 'latest']),
  //     )
  //     .then((promise) =>
  //       pendingBalancesList.push({
  //         address: token.address,
  //         promise,
  //       }),
  //     ),
  // );

  // const pendingCalls =

  // eslint-disable-next-line no-restricted-syntax
  // for (const token of tokens) {
  // getTokenBalance(batchProviders[chainId], token.address, account).then(
  //   (balance) => {
  //     db.tokens.put({ ...token, balance: balance.toString() });
  //   },
  // );
  // }

  // const nativeToken = await db.nativeTokens.get({ chainId });
  // batchProviders[chainId].getBalance(account).then((balance) => {
  //   db.nativeTokens.put({
  //     ...nativeToken,
  //     balance: balance.toString(),
  //   });
  // });

  // console.log(pendingCalls);

  await batchProviders[chainId].resolveBatch();

  // eslint-disable-next-line no-restricted-syntax
  for (const pendingCall of pendingBalancesList) {
    pendingCall.promise.then((balance) => {
      if (pendingCall.token.wrappedAnalog) {
        db.nativeTokens.put({
          ...pendingCall.token,
          balance: balance.toString(),
        });
      } else {
        db.tokens.put({ ...pendingCall.token, balance: balance.toString() });
      }
    });
  }
};

const encodeGetErc20BalanceData = async (address, account, provider) => {
  const minABI = [
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      type: 'function',
    },
  ];
  const contract = new ethers.Contract(address, minABI, provider);

  return contract.populateTransaction.balanceOf(account);
};
