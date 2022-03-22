import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorWidget } from './ErrorWidget';
import ClockIcon from '../assets/svg/layout__clock-icon.svg';
import BookIcon from '../assets/svg/layout__book-icon.svg';
import PyramidIllustration from '../assets/svg/layout__pyramid.svg';
import SphereIllustration from '../assets/svg/layout__sphere.svg';

import '../styles/Main.scss';

export const Layout = ({ children, title, error }) => (
  <div className="root">
    <ErrorWidget error={error} />
    <Header />
    <main className="layout">
      <div className="content layout__heading-container">
        <h1 className="layout__heading">{title}</h1>

        {/* desktop buttons block start */}
        <a href="/" className="button button_gray layout__button">
          Ambrosus Bridge Guide
        </a>

        <Link to="/history" className="button button_black layout__button">
          <img
            src={ClockIcon}
            alt="clock icon"
            className="layout__button-icon"
          />
          Transaction history
        </Link>
        {/* desktop buttons block end */}

        {/* mobile buttons block start */}
        <a href="/" className="layout__mobile-button">
          <img
            src={BookIcon}
            alt="book icon"
            className="layout__mobile-button-icon"
          />
        </a>

        <Link to="/" className="layout__mobile-button">
          <img
            src={ClockIcon}
            alt="clock icon"
            className="layout__mobile-button-icon"
          />
        </Link>
        {/* mobile buttons block end */}
      </div>
      <div className="layout__container">{children}</div>
    </main>
    <Footer />
    <img
      src={PyramidIllustration}
      alt="pyramid illustration"
      className="root__pyramid"
    />
    <img
      src={SphereIllustration}
      alt="sphere illustration"
      className="root__sphere"
    />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  error: PropTypes.string,
};

export default Layout;
