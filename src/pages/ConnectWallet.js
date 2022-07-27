import * as React from 'react';
import { useEffect } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
import { InjectedConnector } from '@web3-react/injected-connector';
import {
  ConfiguredInjectedConnector,
  ConfiguredWalletConnectConnector,
} from '../utils/web3ReactConnectors';
import ChevronIcon from '../assets/svg/chevron.svg';
import MetaMaskIcon from '../assets/img/connect-wallet__metamask.jpg';
import WalletConnectIcon from '../assets/img/connect-wallet__wallet-connect.png';
import changeChainId from '../utils/ethers/changeChainId';
import { ambChainId } from '../utils/providers';
import { allNetworks } from '../utils/networks';
import useError from '../hooks/useError';

const ConnectWallet = () => {
  const { error, activate, account, connector } = useWeb3React();
  const { setError } = useError();
  const history = useHistory();

  const handleMetamaskLogin = () => {
    if (window.ethereum) {
      activate(ConfiguredInjectedConnector).then(() => {
        sessionStorage.setItem('wallet', 'metamask');
        history.push('/exchange');
      });
    } else {
      window
        .open(
          `https://metamask.app.link/dapp/${window.location.href}`,
          '_blank',
        )
        .focus();
    }
  };

  const handleWalletConnectLogin = () => {
    activate(ConfiguredWalletConnectConnector).then(() => {
      sessionStorage.setItem('wallet', 'wallet-connect');
      history.push('/exchange');
    });
  };

  useEffect(async () => {
    if (error instanceof UnsupportedChainIdError) {
      const networksNames = Object.values(allNetworks)
        .map((network) => network.name)
        .join(', ');

      setError(
        `Please, select supported network in your wallet. Supported networks: ${networksNames}`,
      );

      if (connector instanceof InjectedConnector && !document.hidden) {
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
