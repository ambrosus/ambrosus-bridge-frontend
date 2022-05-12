import { useWeb3React } from '@web3-react/core';
import {
  ConfiguredInjectedConnector,
  ConfiguredWalletConnectConnector,
} from '../utils/web3ReactConnectors';

const useAutoLogin = () => {
  const { activate } = useWeb3React();

  const autoLogin = async () => {
    const previousLogin = sessionStorage.getItem('wallet');
    if (previousLogin === 'metamask') {
      activate(ConfiguredInjectedConnector);
    } else if (previousLogin === 'wallet-connect') {
      activate(ConfiguredWalletConnectConnector);
    }
  };

  return { autoLogin };
};

export default useAutoLogin;
