import { ethers } from 'ethers';

const {
  REACT_APP_ETH_CHAIN_ID,
  REACT_APP_AMB_CHAIN_ID,
  REACT_APP_INFURA_KEY,
  REACT_APP_AMB_RPC_URL,
  REACT_APP_ETH_WS_RPC_URL,
  REACT_APP_ETH_RPC_URL,
  REACT_APP_ENV,
} = process.env;

// ethereum read-only provider configuration
export const ethChainId = +REACT_APP_ETH_CHAIN_ID;

const ethProvider =
  REACT_APP_ENV === 'production'
    ? new ethers.providers.WebSocketProvider(
        REACT_APP_ETH_WS_RPC_URL + REACT_APP_INFURA_KEY,
        ethChainId,
      )
    : new ethers.providers.StaticJsonRpcProvider(
        REACT_APP_ETH_RPC_URL + REACT_APP_INFURA_KEY,
        ethChainId,
      );

// ambrosus read-only provider configuration
export const ambChainId = +REACT_APP_AMB_CHAIN_ID;

export const ambProvider = new ethers.providers.StaticJsonRpcProvider(
  REACT_APP_AMB_RPC_URL,
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
