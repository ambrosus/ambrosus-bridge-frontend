import { allNetworks } from './networks';

const formatTokenListFromConfig = (tokens) =>
  [tokens.WETH, tokens.SAMB].reduce((list, token) => {
    const ambTokenEntity = {
      ...token,
      chainId: allNetworks.amb.chainId,
      address: token.addresses.amb,
      primaryNet: allNetworks[token.primaryNet].chainId,
    };
    const ethTokenEntity = {
      ...token,
      chainId: allNetworks.eth.chainId,
      address: token.addresses.eth,
      primaryNet: allNetworks[token.primaryNet].chainId,
    };

    return [...list, ambTokenEntity, ethTokenEntity];
  }, []);

export default formatTokenListFromConfig;
