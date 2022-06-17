import NetworksConfig from '../networks.json';

const { REACT_APP_ENV } = process.env;

export const allNetworks = NetworksConfig[REACT_APP_ENV];

const { amb, eth } = allNetworks;

export const supportedNetworks = [eth];
export const AmbrosusNetwork = amb;

export const getNetworkByChainId = (chainId) =>
  Object.values(allNetworks).find((network) => network.chainId === chainId);

export const networksChainIdDict = {
  amb: amb.chainId,
  eth: eth.chainId,
};
