import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
import addNetworkToMetamask from '../utils/addNetworkToMetamask';
import { ReactComponent as MetamaskIcon } from '../assets/svg/metamask-menu-icon.svg';
import LogoutIcon from '../assets/svg/logout.svg';
import MetaMaskLogo from '../assets/img/connect-wallet__metamask.jpg';
import WalletConnectLogo from '../assets/img/connect-wallet__wallet-connect.png';

export const MobileMenu = ({
  data = [{}],
  isOpen = false,
  toggleMenu = () => {},
}) => {
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(-1);

  useEffect(() => {
    if (isOpen) document.querySelector('body').style.overflow = 'hidden';
    else document.querySelector('body').style.overflow = '';
  }, [isOpen]);

  const toggleSubmenu = (index) =>
    setOpenSubmenuIndex(index === openSubmenuIndex ? -1 : index);

  const { account, deactivate, connector } = useWeb3React();

  const history = useHistory();
  const logout = () => {
    sessionStorage.setItem('wallet', '');
    history.push('/');
    deactivate();
    toggleMenu();
  };

  return (
    <div className={`mobile-menu ${isOpen ? 'mobile-menu_open' : ''}`}>
      {account ? (
        <div className="mobile-menu__account">
          <div className="account account_mobile">
            <div className="account__wallet-logo-container">
              <img
                src={walletLogo(connector)}
                alt="wallet icon"
                className="account__wallet-logo"
              />
            </div>
            <span className="account__address">{formatAddress(account)}</span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="logout logout_mobile"
          >
            <img src={LogoutIcon} alt="wallet icon" className="logout__icon" />
            <span className="logout__text">LOG OUT</span>
          </button>
        </div>
      ) : null}

      {data.map((menuItem, i) => {
        if (menuItem.type === 'submenu') {
          return (
            <MobileSubmenu
              name={menuItem.name}
              data={menuItem.data}
              index={i}
              toggleSubmenu={() => toggleSubmenu(i)}
              isOpen={openSubmenuIndex === i}
              showAddMetamaskButton={menuItem.showAddMetamaskButton}
            />
          );
        }
        if (menuItem.type === 'link') {
          return (
            <a
              href={menuItem.link}
              className="mobile-menu__link"
              data-number={`—\u00A00${i + 1}`}
              onClick={toggleMenu}
            >
              {menuItem.name}
            </a>
          );
        }
        return null;
      })}
    </div>
  );
};

MobileMenu.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  isOpen: PropTypes.bool,
  toggleMenu: PropTypes.func,
};

const MobileSubmenu = ({
  name = '',
  data = [{}],
  index = 0,
  toggleSubmenu = () => {},
  toggleMenu = () => {},
  isOpen = false,
  showAddMetamaskButton = false,
}) => (
  <div className={`mobile-submenu ${isOpen ? 'mobile-submenu_open' : ''}`}>
    <button
      type="button"
      className="mobile-submenu__name"
      data-number={`—\u00A00${index + 1}`}
      onClick={toggleSubmenu}
    >
      {name}
      <svg viewBox="0 0 15 8" className="mobile-submenu__arrow" fill="none">
        <path
          d="M14.2031 1L7.53644 7L0.869791 0.999999"
          stroke="currentColor"
        />
      </svg>
    </button>
    <div
      className={`mobile-submenu__items ${
        showAddMetamaskButton ? 'mobile-submenu__items_metamask' : ''
      }`}
      style={{
        '--items-amount': data.length,
      }}
    >
      {showAddMetamaskButton ? (
        <button
          type="button"
          className="mobile-submenu__item mobile-submenu__item_metamask"
          onClick={addNetworkToMetamask}
        >
          <MetamaskIcon className="mobile-submenu__metamask-icon" />
          Add to Metamask
        </button>
      ) : null}
      {data.map(({ name: itemName, link }) => (
        <a href={link} className="mobile-submenu__item" onClick={toggleMenu}>
          {itemName}
        </a>
      ))}
    </div>
  </div>
);

MobileSubmenu.propTypes = {
  name: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  index: PropTypes.number,
  toggleSubmenu: PropTypes.func,
  toggleMenu: PropTypes.func,
  isOpen: PropTypes.bool,
  showAddMetamaskButton: PropTypes.bool,
};

const walletLogo = (connector) => {
  if (connector instanceof InjectedConnector) return MetaMaskLogo;
  if (connector instanceof WalletConnectConnector) return WalletConnectLogo;
  return null;
};

const formatAddress = (addr) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;
