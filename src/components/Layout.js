import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import ClockIcon from '../assets/svg/layout__clock-icon.svg';

import '../styles/Main.scss';

export const Layout = ({ children, title }) => (
  <>
    <Header />
    <main className="layout">
      <div className="content layout__heading-container">
        <h1 className="layout__heading">{title}</h1>
        <a href="/" className="button button_gray layout__button">
          Ambrosus Bridge Guide
        </a>
        <Link to="/" className="button button_black layout__button">
          <img
            src={ClockIcon}
            alt="clock icon"
            className="layout__button-icon"
          />
          Transaction history
        </Link>
      </div>
      <div className="layout__container">{children}</div>
    </main>

    <Footer />
  </>
);

Layout.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
};

export default Layout;
