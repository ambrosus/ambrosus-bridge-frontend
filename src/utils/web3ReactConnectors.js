import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const {
  REACT_APP_ETH_CHAIN_ID,
  REACT_APP_ETH_RPC_URL,
  REACT_APP_INFURA_KEY,
  REACT_APP_AMB_CHAIN_ID,
  REACT_APP_AMB_RPC_URL,
} = process.env;

export const ConfiguredInjectedConnector = new InjectedConnector({
  supportedChainIds: [+REACT_APP_ETH_CHAIN_ID, +REACT_APP_AMB_CHAIN_ID],
});

export const ConfiguredWalletConnectConnector = new WalletConnectConnector({
  rpc: {
    [+REACT_APP_ETH_CHAIN_ID]: REACT_APP_ETH_RPC_URL + REACT_APP_INFURA_KEY,
    [+REACT_APP_AMB_CHAIN_ID]: REACT_APP_AMB_RPC_URL,
  },
  chainId: 1,
  bridge: 'https://bridge.walletconnect.org',
  pollingInterval: 6000,
  qrcode: true,
  qrcodeModalOptions: {
    mobileLinks: ['metamask'],
  },
});
