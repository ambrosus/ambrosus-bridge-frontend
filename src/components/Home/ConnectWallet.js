import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
import {
  ConfiguredInjectedConnector,
  ConfiguredWalletConnectConnector,
} from '../../utils/web3';
import ChevronIcon from '../../assets/svg/chevron.svg';
import MetaMaskIcon from '../../assets/img/connect-wallet__metamask.jpg';
import WalletConnectIcon from '../../assets/img/connect-wallet__wallet-connect.png';

const ConnectWallet = () => {
  const web3 = useWeb3React();
  const history = useHistory();

  const handleMetamaskLogin = () => {
    web3
      .activate(ConfiguredInjectedConnector)
      .then(() => history.push('/history'));
  };

  const handleWalletConnectLogin = () => {
    web3
      .activate(ConfiguredWalletConnectConnector)
      .then(() => history.push('/exchange'));
  };

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
