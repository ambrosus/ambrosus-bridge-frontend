import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { allNetworks } from './networks';

const { REACT_APP_INFURA_KEY } = process.env;

export const ConfiguredInjectedConnector = new InjectedConnector({
  supportedChainIds: [allNetworks.eth.chainId, allNetworks.amb.chainId],
});

export const ConfiguredWalletConnectConnector = new WalletConnectConnector({
  rpc: {
    [allNetworks.eth.chainId]: allNetworks.eth.rpcUrl + REACT_APP_INFURA_KEY,
    [allNetworks.amb.chainId]: allNetworks.amb.rpcUrl,
  },
  chainId: 1,
  bridge: 'https://bridge.walletconnect.org',
  pollingInterval: 6000,
  qrcode: true,
  qrcodeModalOptions: {
    mobileLinks: ['metamask', 'trustee'],
  },
});
