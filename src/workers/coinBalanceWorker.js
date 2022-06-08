import { ethers } from 'ethers';
import Dexie from 'dexie';
import { db } from '../db';
import providers from '../utils/providers';
import CustomJsonRpcBatchProvider from '../utils/ethers/CustomJsonRpcBatchProvider';
import { allNetworks } from '../utils/networks';

// TODO: decompose this to several files
const ethProvider = new CustomJsonRpcBatchProvider(
  allNetworks.eth.rpcUrl + process.env.REACT_APP_INFURA_KEY,
  allNetworks.eth.chainId,
);

const ambProvider = new CustomJsonRpcBatchProvider(
  allNetworks.amb.rpcUrl,
  allNetworks.amb.chainId,
);

const batchProviders = {
  [allNetworks.eth.chainId]: ethProvider,
  [allNetworks.amb.chainId]: ambProvider,
};

let currentAccount;

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', ({ data: message }) => {
  if (message.type === 'start') {
    startBalanceMonitoring(message.account);
    currentAccount = message.account;
  }
  if (message.type === 'stop') {
    stopBalanceMonitoring(currentAccount);
  }
  if (message.type === 'restart') {
    stopBalanceMonitoring(currentAccount);
    startBalanceMonitoring(message.account);
    currentAccount = message.account;
  }
});

const startBalanceMonitoring = async (account) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const chainId of [allNetworks.eth.chainId, allNetworks.amb.chainId]) {
    fetchBalancesOfNetwork(account, chainId);
    providers[chainId].on('block', () =>
      fetchBalancesOfNetwork(account, chainId),
    );
  }
};

const stopBalanceMonitoring = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const chainId of [allNetworks.amb.chainId, allNetworks.eth.chainId]) {
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

  // eslint-disable-next-line no-restricted-globals
  self.postMessage({ type: 'update' });
};

// TODO: refactor with ethers "attach" method
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

// fallback for Dexie observable
// due to issues with useLiveQuery in Safari < 15.4
// proposed in here
// https://github.com/dexie/Dexie.js/issues/1573

if (typeof BroadcastChannel === 'undefined') {
  Dexie.on('storagemutated', (updatedParts) => {
    postMessage({ type: 'storagemutated', updatedParts });
  });
}
