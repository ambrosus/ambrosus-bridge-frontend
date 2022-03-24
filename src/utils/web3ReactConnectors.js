import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { getAllChainIds, getAllNetworks } from './networks';

const networks = getAllNetworks();
const chainIds = getAllChainIds();

export const ConfiguredInjectedConnector = new InjectedConnector({
  supportedChainIds: chainIds,
});

const walletRPC = {};
networks.forEach((network) => {
  // eslint-disable-next-line prefer-destructuring
  walletRPC[network.chainId] = network.rpcUrl;
});

export const ConfiguredWalletConnectConnector = new WalletConnectConnector({
  rpc: walletRPC,
  chainId: 1,
  bridge: 'https://bridge.walletconnect.org',
  pollingInterval: 6000,
  qrcode: true,
  qrcodeModalOptions: {
    mobileLinks: ['metamask'],
  },
});
