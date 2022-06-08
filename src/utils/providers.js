import { ethers } from 'ethers';
import { allNetworks } from './networks';

const { REACT_APP_ENV, REACT_APP_INFURA_KEY } = process.env;

// TODO: change chainId constants for allNetworks[network].chainId in all code
// ethereum read-only provider configuration
export const ethChainId = allNetworks.eth.chainId;

const ethProvider =
  REACT_APP_ENV === 'production'
    ? new ethers.providers.WebSocketProvider(
        allNetworks.eth.rpcUrlWS + REACT_APP_INFURA_KEY,
        ethChainId,
      )
    : new ethers.providers.StaticJsonRpcProvider(
        allNetworks.eth.rpcUrl + REACT_APP_INFURA_KEY,
        ethChainId,
      );

// ambrosus read-only provider configuration
export const ambChainId = allNetworks.amb.chainId;

export const ambProvider = new ethers.providers.StaticJsonRpcProvider(
  allNetworks.amb.rpcUrl,
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
