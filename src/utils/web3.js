import { InjectedConnector } from '@web3-react/injected-connector';
import { utils } from 'ethers';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import getNetworks from './getNetworks';

const networks = getNetworks();

const chainIds = networks.map((network) => network.chainId);
export const ConfiguredInjectedConnector = new InjectedConnector({
  supportedChainIds: chainIds,
});

const walletRPC = {};
networks.forEach((network) => {
  // eslint-disable-next-line prefer-destructuring
  walletRPC[network.chainId] = network.rpcUrls[0];
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
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: utils.hexlify(network.chainId) }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: utils.hexlify(network.chainId),
              chainName: network.name,
              rpcUrls: network.rpcUrls,
            },
          ],
        });
      } catch (addError) {
        // eslint-disable-next-line no-console
        console.error('something happened', addError);
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
};
