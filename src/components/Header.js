import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import Logo from '../assets/svg/logo.svg';
import { MobileMenu } from './MobileMenu';
import WalletConnectLogo from '../assets/img/connect-wallet__wallet-connect.png';
import LogoutIcon from '../assets/svg/logout.svg';

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
  const { account, deactivate } = useWeb3React();
  const history = useHistory();
  const logout = () => {
    history.push('/');
    deactivate();
  };

  return (
    <header className="header">
      <div className="content header__content">
        <Link to="/" className="header__logo-wrapper">
          <img src={Logo} alt="logo" className="header__logo" />
        </Link>

        {data.map((menuItem) => {
          if (menuItem.type === 'submenu') {
            return <Submenu name={menuItem.name} data={menuItem.data} />;
          }
          if (menuItem.type === 'link') {
            return (
              <a href={menuItem.link} className="header__link">
                {menuItem.name}
              </a>
            );
          }
          return null;
        })}

        {account ? (
          <>
            <div className="account">
              <img
                src={WalletConnectLogo}
                alt="wallet icon"
                className="account__wallet-logo"
              />
              <span className="account__address">{formatAddress(account)}</span>
            </div>

            <button type="button" onClick={logout} className="logout">
              <img
                src={LogoutIcon}
                alt="wallet icon"
                className="logout__icon"
              />
              <span className="logout__text">LOG OUT</span>
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

const Submenu = ({ name = '', data = [{}] }) => (
  <div className="submenu">
    <p className="submenu__name">
      {name}
      <svg viewBox="0 0 15 8" className="submenu__arrow" fill="none">
        <path
          d="M14.2031 1L7.53644 7L0.869791 0.999999"
          stroke="currentColor"
        />
      </svg>
    </p>
    <div className="submenu__items" style={{ '--items-amount': data.length }}>
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
};

const formatAddress = (addr) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

const HEADER_DATA = [
  {
    type: 'submenu',
    name: 'Use Ambrosus',
    data: [
      {
        name: 'About AMB',
        link: 'https://ambrosus.io/about',
      },
      {
        name: 'Staking',
        link: 'https://staking.ambrosus.io/',
      },
      {
        name: 'Wallet',
        link: 'https://ambrosus.io/wallet',
      },
      {
        name: 'Explorer',
        link: 'https://explorer.ambrosus.com/',
      },
      {
        name: 'Roadmap',
        link: 'https://roadmap.ambrosus.io/',
      },
    ],
  },
  {
    type: 'link',
    name: 'Projects',
    link: 'https://ambrosus.io/projects',
  },
  {
    type: 'submenu',
    name: 'Community',
    data: [
      {
        name: 'Community',
        link: 'https://ambrosus.io/community',
      },
      {
        name: 'AMB',
        link: 'https://ambrosus.io/amb',
      },
    ],
  },
  {
    type: 'link',
    name: 'About',
    link: 'https://ambrosus.io/about',
  },
];
