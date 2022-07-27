
import { allNetworks } from './networks';

const formatTokenListFromConfig = (tokens) =>
  [tokens.WETH, tokens.SAMB].reduce((list, token) => {
    const ambTokenEntity = {
      ...token,
      chainId: allNetworks.amb.chainId,
      address: token.addresses.amb,
      primaryNet: allNetworks[token.primaryNet].chainId,
      balance: '',
    };
    const ethTokenEntity = {
      ...token,
      chainId: allNetworks.eth.chainId,
      address: token.addresses.eth,
      primaryNet: allNetworks[token.primaryNet].chainId,
      balance: '',
    };

    return [...list, ambTokenEntity, ethTokenEntity];
  }, []);

export default formatTokenListFromConfig;
