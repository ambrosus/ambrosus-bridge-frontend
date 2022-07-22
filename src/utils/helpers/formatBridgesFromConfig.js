import { allNetworks } from '../networks';

const formatBridgesFromConfig = (bridges) =>
  Object.keys(bridges).reduce(
    (dict, network) => ({
      ...dict,
      [allNetworks[network].chainId]: {
        native: bridges[network].amb,
        foreign: bridges[network].side,
      },
    }),
    {},
  );

export default formatBridgesFromConfig;
