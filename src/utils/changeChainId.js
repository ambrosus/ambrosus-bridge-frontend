import { utils } from 'ethers';
import { getNetworkByChainId } from './networks';

const changeChainId = async (provider, chainId) => {
  const selectedNetwork = getNetworkByChainId(chainId);
  const hexChainId = utils.hexValue(chainId);

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
              chainName: selectedNetwork.name,
              rpcUrls: [selectedNetwork.rpcUrl],
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

export default changeChainId;
