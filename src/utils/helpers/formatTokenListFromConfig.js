import { allNetworks } from '../networks';

const formatTokenListFromConfig = (tokens) =>
  Object.values(tokens).reduce((list, token) => {
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
    const bscTokenEntity = {
      ...token,
      chainId: allNetworks.bsc.chainId,
      address: token.addresses.bsc,
      primaryNet: allNetworks[token.primaryNet].chainId,
    };

    return [
      ...list,
      ...(token.addresses.amb ? [ambTokenEntity] : []),
      ...(token.addresses.eth ? [ethTokenEntity] : []),
      ...(token.addresses.bsc ? [bscTokenEntity] : []),
    ];
  }, []);

export default formatTokenListFromConfig;
