import { ethers } from 'ethers';

const { INFURA_KEY, NODE_ENV } = process.env;

// ethereum read-only provider configuration
const ethChainId = NODE_ENV === 'production' ? 1 : 4;

const ethProvider = new ethers.providers.FallbackProvider(
  [
    new ethers.providers.InfuraProvider(ethChainId, INFURA_KEY),
    // new ethers.providers.EtherscanProvider(ethChainId),
  ],
  1,
);

// ambrosus read-only provider configuration
const ambChainId = NODE_ENV === 'production' ? 16718 : 22035;

const ambRPCUrl =
  NODE_ENV === 'production'
    ? 'https://network.ambrosus.io'
    : 'https://network.ambrosus-test.io';

export const ambProvider = new ethers.providers.JsonRpcProvider(ambRPCUrl);

// binance smart chain read-only provider configuration
const bscChainId = NODE_ENV === 'production' ? 56 : 97;

const bscRPCUrlList =
  NODE_ENV === 'production'
    ? ['https://bsc-dataseed.binance.org/', 'https://bsc-dataseed4.defibit.io/']
    : [
        'https://data-seed-prebsc-1-s1.binance.org:8545/',
        'https://data-seed-prebsc-1-s2.binance.org:8545/',
      ];

const bscProvider = new ethers.providers.FallbackProvider(
  bscRPCUrlList.map((RPCUrl) => new ethers.providers.JsonRpcProvider(RPCUrl)),
  1,
);

// exporting
const providers = {
  [ethChainId]: ethProvider,
  [ambChainId]: ambProvider,
  [bscChainId]: bscProvider,
};

export default providers;
