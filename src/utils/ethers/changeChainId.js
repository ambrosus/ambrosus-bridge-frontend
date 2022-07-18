import { utils } from 'ethers';
import { getNetworkByChainId } from '../networks';
import { db } from '../../db';

// TODO: add rpcUrls

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
          blockExplorerUrls: [selectedNetwork.explorerUrl],
        },
      ],
    });
  }
};

export default changeChainId;
