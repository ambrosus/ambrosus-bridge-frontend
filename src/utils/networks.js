import NetworkMock from './networks.mock.json';
const {
  REACT_APP_ETH_CHAIN_ID,
  REACT_APP_AMB_CHAIN_ID,
  REACT_APP_AMB_RPC_URL,
  REACT_APP_ETH_RPC_URL,
} = process.env;

export const getAllNetworks = () => {
  let networks;
  if (process.env.REACT_APP_ENV === 'production') {
    // ...
    // fetching
    // ...
  } else {
    networks = NetworkMock;
  }

  const [amb, eth] = Object.values(networks);

  amb.chainId = +REACT_APP_AMB_CHAIN_ID;
  eth.chainId = +REACT_APP_ETH_CHAIN_ID;

  amb.rpcUrl = REACT_APP_AMB_RPC_URL;
  eth.rpcUrl = REACT_APP_ETH_RPC_URL;

  return [amb, eth];
};

export const getSupportedNetworks = () => {
  const [, eth] = getAllNetworks();
  return [eth];
};

export const [AmbrosusNetwork] = getAllNetworks();

export const getNetworkByChainId = (chainId) => {
  const networks = getAllNetworks();
  return networks.find((network) => network.chainId === chainId);
};

export const networksChainIdDict = {
  amb: REACT_APP_AMB_CHAIN_ID,
  eth: REACT_APP_ETH_CHAIN_ID,
};
