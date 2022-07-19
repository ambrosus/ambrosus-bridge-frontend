import { utils } from 'ethers';
import { allNetworks } from '../networks';

const formatTokenListFromConfig = ({ SAMB, WETH }) =>
  [SAMB, WETH].reduce((list, token) => {
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
    // const bscTokenEntity = {
    //   ...token,
    //   chainId: allNetworks.bsc.chainId,
    //   address: token.addresses.bsc,
    //   primaryNet: allNetworks[token.primaryNet].chainId,
    //   balance: '',
    // };

    return [
      ...list,
      ...(utils.isAddress(token.addresses.amb) ? [ambTokenEntity] : []),
      ...(utils.isAddress(token.addresses.eth) ? [ethTokenEntity] : []),
      // ...(utils.isAddress(token.addresses.bsc) ? [bscTokenEntity] : []),
    ];
  }, []);

export default formatTokenListFromConfig;
