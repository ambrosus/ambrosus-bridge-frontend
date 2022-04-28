import { ethers } from 'ethers';

const { REACT_APP_ETH_CHAIN_ID, REACT_APP_AMB_CHAIN_ID, REACT_APP_INFURA_KEY } =
  process.env;

// ethereum read-only provider configuration
export const ethChainId = +REACT_APP_ETH_CHAIN_ID;

const ethProvider = new ethers.providers.InfuraWebSocketProvider(
  ethChainId,
  REACT_APP_INFURA_KEY,
);

// ambrosus read-only provider configuration
export const ambChainId = +REACT_APP_AMB_CHAIN_ID;

export const ambProvider = new ethers.providers.WebSocketProvider(
  'wss://network.ambrosus-dev.io/ws',
  ambChainId,
);

// binance smart chain read-only provider configuration
// export const bscChainId = REACT_APP_ENV === 'production' ? 56 : 97;
//
// const bscRPCUrlList =
//   REACT_APP_ENV === 'production'
//     ? ['https://bsc-dataseed.binance.org/', 'https://bsc-dataseed4.defibit.io/']
//     : [
//         'https://data-seed-prebsc-1-s1.binance.org:8545/',
//         'https://data-seed-prebsc-1-s2.binance.org:8545/',
//       ];
//
// const bscProvider = new ethers.providers.FallbackProvider(
//   bscRPCUrlList.map((RPCUrl) => new ethers.providers.JsonRpcProvider(RPCUrl)),
//   1,
// );

const providers = {
  [ethChainId]: ethProvider,
  [ambChainId]: ambProvider,
  // [bscChainId]: bscProvider,
};

export default providers;
