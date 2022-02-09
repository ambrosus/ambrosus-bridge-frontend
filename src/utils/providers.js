import { ethers } from 'ethers';

const INFURA_KEY = process.env.REACT_APP_INFURA_API_KEY;
const AMBROSUS_RPC_URL = process.env.REACT_APP_AMBROSUS_RPC_URL;

export const ethProvider = new ethers.providers.FallbackProvider(
  [
    new ethers.providers.InfuraProvider('homestead', INFURA_KEY),
    new ethers.providers.EtherscanProvider('homestead'),
  ],
  1,
);

export const ambProvider = new ethers.providers.JsonRpcProvider(
  AMBROSUS_RPC_URL,
);

export const bscProvider = new ethers.providers.FallbackProvider(
  [
    new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'),
    new ethers.providers.JsonRpcProvider('https://bsc-dataseed4.defibit.io/'),
  ],
  1,
);
