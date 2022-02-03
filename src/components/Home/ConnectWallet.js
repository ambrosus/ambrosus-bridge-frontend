import * as React from 'react';
import ChevronIcon from '../../assets/svg/chevron.svg';
import MetaMaskIcon from '../../assets/img/connect-wallet__metamask.jpg';
import WalletConnectIcon from '../../assets/img/connect-wallet__wallet-connect.png';

const ConnectWallet = () => (
  <div className="content connect-wallet__content">
    <h2 className="connect-wallet__heading">Connect Wallet</h2>

    <div className="wallet-button">
      <div className="wallet-button__logo-container">
        <img
          alt="metamask logo"
          src={MetaMaskIcon}
          className="wallet-button__logo"
        />
      </div>
      <div className="wallet-button__text-container">
        <h3 className="wallet-button__heading">MetaMask</h3>
        <p className="wallet-button__text">Connect using your browser wallet</p>
      </div>
      <img src={ChevronIcon} className="wallet-button__chevron" alt="#" />
    </div>

    <div className="wallet-button">
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
    </div>
  </div>
);

export default ConnectWallet;
