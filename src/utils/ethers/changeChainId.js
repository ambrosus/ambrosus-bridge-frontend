import { utils } from 'ethers';
import { getNetworkByChainId } from '../networks';
import { db } from '../../db';

const changeChainId = async (provider, chainId) => {
  const selectedNetwork = getNetworkByChainId(chainId);
  const hexChainId = utils.hexValue(chainId);
  const nativeCoin = await db.nativeTokens.get({ chainId });

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
              nativeCurrency: {
                name: nativeCoin.name,
                symbol: nativeCoin.symbol,
                decimals: nativeCoin.denomination,
              },
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
