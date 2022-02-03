import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/svg/logo.svg';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <header className="header">
        <div className="content header__content">
          <Link to="/" className="header__logo-wrapper">
            <img src={Logo} alt="logo" className="header__logo" />
          </Link>

          <a href="https://ambrosus.io/about/" className="header__link">
            About Ambrosus
          </a>
          <a href="https://ambrosus.io/business/" className="header__link">
            Business
          </a>
          <a href="https://ambrosus.io/developers" className="header__link">
            Developers
          </a>
          <a href="https://ambrosus.io/community" className="header__link">
            Community
          </a>

          <div
            className={`burger-icon ${isOpen ? 'burger-icon_open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-hidden
          >
            <span className="burger-icon__first-line burger-icon__line" />
            <span className="burger-icon__second-line burger-icon__line" />
            <span className="burger-icon__third-line burger-icon__line" />
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${isOpen ? 'mobile-menu_open' : ''}`}>
        <a
          href="https://ambrosus.io/about/"
          className="mobile-menu__link"
          data-number={`—\u00A00${1}`}
          onClick={toggleMenu}
        >
          About Ambrosus
        </a>
        <a
          href="https://ambrosus.io/business/"
          className="mobile-menu__link"
          data-number={`—\u00A00${2}`}
          onClick={toggleMenu}
        >
          Business
        </a>
        <a
          href="https://ambrosus.io/developers"
          className="mobile-menu__link"
          data-number={`—\u00A00${3}`}
          onClick={toggleMenu}
        >
          Developers
        </a>
        <a
          href="https://ambrosus.io/community"
          className="mobile-menu__link"
          data-number={`—\u00A00${4}`}
          onClick={toggleMenu}
        >
          Community
        </a>
      </div>
    </>
  );
};
