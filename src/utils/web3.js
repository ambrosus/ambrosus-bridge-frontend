import { InjectedConnector } from '@web3-react/injected-connector';
import getNetworks from './getNetworks';

const networks = getNetworks();
const chainIds = networks.map((network) => network.chainId);

export const ConfiguredInjectedConnector = new InjectedConnector({
  supportedChainIds: chainIds,
});
