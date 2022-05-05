import * as React from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
import { useContext, useEffect } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import {
  ConfiguredInjectedConnector,
  ConfiguredWalletConnectConnector,
} from '../utils/web3ReactConnectors';
import ChevronIcon from '../assets/svg/chevron.svg';
import MetaMaskIcon from '../assets/img/connect-wallet__metamask.jpg';
import WalletConnectIcon from '../assets/img/connect-wallet__wallet-connect.png';
import ErrorContext from '../contexts/ErrorContext';
import changeChainId from '../utils/ethers/changeChainId';
import { ambChainId } from '../utils/providers';
import { getAllNetworks } from '../utils/networks';

const ConnectWallet = () => {
  const { error, activate, account, connector } = useWeb3React();
  const { setError } = useContext(ErrorContext);
  const history = useHistory();

  const handleMetamaskLogin = () => {
    activate(ConfiguredInjectedConnector).then(() => {
      sessionStorage.setItem('wallet', 'metamask');
      history.push('/exchange');
    });
  };

  const handleWalletConnectLogin = () => {
    activate(ConfiguredWalletConnectConnector).then(() => {
      sessionStorage.setItem('wallet', 'wallet-connect');
      history.push('/exchange');
    });
  };

  useEffect(async () => {
    if (error instanceof UnsupportedChainIdError) {
      const networks = getAllNetworks();
      const networksNames = networks.map((network) => network.name).join(', ');
      setError(
        `Please, select supported network in your wallet. Supported networks: ${networksNames}`,
      );

      if (connector instanceof InjectedConnector) {
        await changeChainId(window.ethereum, ambChainId);
      }
    }
    if (account) {
      setError(null);
      history.push('/exchange');
    }
  }, [error]);

  return (
    <div className="content connect-wallet__content">
      <h2 className="connect-wallet__heading">Connect Wallet</h2>
      <button
        type="button"
        className="wallet-button"
        onClick={handleMetamaskLogin}
      >
        <div className="wallet-button__logo-container">
          <img
            alt="metamask logo"
            src={MetaMaskIcon}
            className="wallet-button__logo"
          />
        </div>
        <div className="wallet-button__text-container">
          <h3 className="wallet-button__heading">MetaMask</h3>
          <p className="wallet-button__text">
            Connect using your browser wallet
          </p>
        </div>
        <img src={ChevronIcon} className="wallet-button__chevron" alt="#" />
      </button>

      <button
        type="button"
        className="wallet-button"
        onClick={handleWalletConnectLogin}
      >
        <div className="wallet-button__logo-container">
          <img
            alt="wallet-connect logo"
            src={WalletConnectIcon}
            className="wallet-button__logo"
          />
        </div>
        <div className="wallet-button__text-container">
          <h3 className="wallet-button__heading">WalletConnect</h3>
          <p className="wallet-button__text">Connect using WalletConnect</p>
        </div>
        <img src={ChevronIcon} className="wallet-button__chevron" alt="#" />
      </button>
    </div>
  );
};

export default ConnectWallet;
