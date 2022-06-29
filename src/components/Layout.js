import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorWidget } from './ErrorWidget';
import useError from '../hooks/useError';
import ClockIcon from '../assets/svg/layout__clock-icon.svg';
import BookIcon from '../assets/svg/layout__book-icon.svg';
import PyramidIllustration from '../assets/svg/layout__pyramid.svg';
import SphereIllustration from '../assets/svg/layout__sphere.svg';

import '../styles/Main.scss';

export const Layout = ({ children, title }) => {
  const { account } = useWeb3React();
  const { error } = useError();
  return (
    <div className="root">
      <ErrorWidget error={error} />
      <Header />
      <main className="layout">
        <div className="content layout__heading-container">
          <h1 className="layout__heading">{title}</h1>

          {/* desktop buttons block start */}
          <a
            href="https://blog.ambrosus.io/ambrosus-guide-connecting-and-transacting-via-the-amb-bridge-89f27a60b8d2"
            target="_blank"
            className="button button_gray layout__button"
          >
            Ambrosus Bridge Guide
          </a>
          {/* TODO && */}
          {account ? (
            <Link to="/history" className="button button_black layout__button">
              <img
                src={ClockIcon}
                alt="clock icon"
                className="layout__button-icon"
              />
              Transaction history
            </Link>
          ) : null}

          {/* desktop buttons block end */}

          {/* mobile buttons block start */}
          <a href="/" className="layout__mobile-button">
            <img
              src={BookIcon}
              alt="book icon"
              className="layout__mobile-button-icon"
            />
          </a>
          {/* TODO && */}

          {account ? (
            <Link to="/history" className="layout__mobile-button">
              <img
                src={ClockIcon}
                alt="clock icon"
                className="layout__mobile-button-icon"
              />
            </Link>
          ) : null}
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
};

Layout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default Layout;
