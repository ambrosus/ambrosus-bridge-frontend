import { InjectedConnector } from '@web3-react/injected-connector';
import { utils } from 'ethers';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { AmbrosusNetwork, getSupportedNetworks } from './networks';

const supportedNetworks = getSupportedNetworks();

const chainIds = [...supportedNetworks, AmbrosusNetwork].map(
  (network) => network.chainId,
);
export const ConfiguredInjectedConnector = new InjectedConnector({
  supportedChainIds: chainIds,
});

const walletRPC = {};
[...supportedNetworks, AmbrosusNetwork].forEach((network) => {
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

export const changeChainId = async (provider, network) => {
  const hexChainId = utils.hexValue(network.chainId);

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: hexChainId,
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
            },
          ],
        });
      } catch (addError) {
        // eslint-disable-next-line no-console
        console.error('something happened', addError);
        // handle "add" error
      }
    }
    console.error(switchError);
    // handle other "switch" errors
  }
};
