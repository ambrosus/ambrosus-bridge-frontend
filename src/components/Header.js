import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import Logo from '../assets/svg/logo.svg';
import { MobileMenu } from './MobileMenu';
import WalletConnectLogo from '../assets/img/connect-wallet__wallet-connect.png';
import MetaMaskLogo from '../assets/img/connect-wallet__metamask.jpg';
import LogoutIcon from '../assets/svg/logout.svg';
import { ReactComponent as MetamaskIcon } from '../assets/svg/metamask-menu-icon.svg';
import addNetworkToMetamask from '../utils/addNetworkToMetamask';
import formatAddress from '../utils/helpers/formatAddres';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <HeaderLayout
        {...{
          toggleMenu,
          isOpen,
        }}
        data={HEADER_DATA}
      />
      <MobileMenu
        {...{
          isOpen,
          toggleMenu,
        }}
        data={HEADER_DATA}
      />
    </>
  );
};

const HeaderLayout = ({
  data = [{}],
  isOpen = false,
  toggleMenu = () => {},
}) => {
  const { account, deactivate, connector } = useWeb3React();
  const history = useHistory();
  const logout = () => {
    sessionStorage.setItem('wallet', '');
    history.push('/');
    deactivate();
  };

  return (
    <header className="header">
      <div className="content header__content">
        <Link to="/" className="header__logo-wrapper">
          <img src={Logo} alt="logo" className="header__logo" />
        </Link>

        {data.map((menuItem, i) => {
          if (menuItem.type === 'submenu') {
            return (
              <Submenu
                name={menuItem.name}
                data={menuItem.data}
                isLastItem={data.length - 1 === i}
                key={menuItem.name}
                showAddMetamaskButton={menuItem.showAddMetamaskButton}
              />
            );
          }
          if (menuItem.type === 'link') {
            return (
              <a
                href={menuItem.link}
                className="header__link"
                key={menuItem.name}
              >
                {menuItem.name}
              </a>
            );
          }
          return null;
        })}

        {account ? (
          <>
            <div className="account">
              <div className="account__wallet-logo-container">
                <img
                  src={walletLogo(connector)}
                  alt="wallet icon"
                  className="account__wallet-logo"
                />
              </div>
              <span className="account__address">{formatAddress(account)}</span>
            </div>

            <button type="button" onClick={logout} className="logout">
              <img
                src={LogoutIcon}
                alt="wallet icon"
                className="logout__icon"
              />
            </button>
          </>
        ) : null}

        <button
          type="button"
          className={`burger-icon ${isOpen ? 'burger-icon_open' : ''}`}
          onClick={toggleMenu}
        >
          <span className="burger-icon__first-line burger-icon__line" />
          <span className="burger-icon__second-line burger-icon__line" />
          <span className="burger-icon__third-line burger-icon__line" />
        </button>
      </div>
    </header>
  );
};

HeaderLayout.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  isOpen: PropTypes.bool,
  toggleMenu: PropTypes.func,
};

const Submenu = ({
  name = '',
  data = [{}],
  showAddMetamaskButton = false,
  isLastItem = false,
}) => (
  <div
    className={`submenu ${isLastItem ? 'submenu_last' : ''} ${
      showAddMetamaskButton ? 'submenu_metamask' : ''
    }`}
  >
    {isLastItem}
    <p className="submenu__name">
      {name}
      <svg viewBox="0 0 15 8" className="submenu__arrow" fill="none">
        <path
          d="M14.2031 1L7.53644 7L0.869791 0.999999"
          stroke="currentColor"
        />
      </svg>
    </p>
    <div
      className="submenu__items"
      style={{
        '--items-amount': showAddMetamaskButton ? data.length + 1 : data.length,
      }}
    >
      {showAddMetamaskButton ? (
        <button
          type="button"
          className="submenu__item submenu__item_metamask"
          onClick={addNetworkToMetamask}
        >
          <MetamaskIcon />
          Add Ambrosus Network to Metamask
        </button>
      ) : null}

      {data.map(({ name: itemName, link }) => (
        <a href={link} key={link} className="submenu__item">
          {itemName}
        </a>
      ))}
    </div>
  </div>
);

Submenu.propTypes = {
  name: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  showAddMetamaskButton: PropTypes.bool,
  isLastItem: PropTypes.bool,
};

const walletLogo = (connector) => {
  if (connector instanceof InjectedConnector) return MetaMaskLogo;
  if (connector instanceof WalletConnectConnector) return WalletConnectLogo;
  return null;
};

const HEADER_DATA = [
  {
    type: 'submenu',
    name: 'ABOUT',
    data: [
      {
        name: 'Company',
        link: 'https://ambrosus.io/about',
      },
      {
        name: 'Team',
        link: 'https://ambrosus.io/team',
      },
      {
        name: 'Roadmap',
        link: 'https://roadmap.ambrosus.io/',
      },
    ],
  },
  {
    type: 'submenu',
    name: 'BUSINESS',
    data: [
      {
        name: 'Enterprise',
        link: 'https://ambrosus.io/business',
      },
      {
        name: 'DeFi',
        link: 'https://ambrosus.io/defi',
      },
    ],
  },
  {
    type: 'submenu',
    name: 'COMMUNITY',
    data: [
      {
        name: 'GET INVOLVED',
        link: 'https://ambrosus.io/community/',
      },
      {
        name: 'FORUM',
        link: 'https://gov.ambrosus.io/',
      },
    ],
  },
  {
    type: 'link',
    name: 'DEVELOPERS',
    link: 'https://ambrosus.io/developers',
  },
  {
    type: 'submenu',
    name: 'Use AMB',
    showAddMetamaskButton: true,
    data: [
      {
        name: 'USE AMB',
        link: 'https://ambrosus.io/amb/',
      },
      {
        name: 'WALLET',
        link: 'https://ambrosus.io/wallet/',
      },
      {
        name: 'STAKING',
        link: 'https://staking.ambrosus.io/',
      },
      {
        name: 'Network Explorer',
        link: 'https://explorer.ambrosus.io/',
      },
      {
        name: 'AMB.TO (Asset Exploer)',
        link: 'https://amb.to/',
      },
      {
        name: 'AMB.Money (ROI Calculator)',
        link: 'https://amb.money/',
      },
      {
        name: 'Network Explorer Beta (Coming soon)',
        link: '#',
      },
    ],
  },
];
