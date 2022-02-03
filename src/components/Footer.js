import * as React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/svg/logo.svg';
import GithubIcon from '../assets/svg/github-icon.svg';
import LinkedInIcon from '../assets/svg/linkedin-icon.svg';
import MediumIcon from '../assets/svg/medium-icon.svg';
import TelegramIcon from '../assets/svg/telegram-icon.svg';
import TwitterIcon from '../assets/svg/twitter-icon.svg';

export const Footer = () => (
  <footer className="footer">
    <div className="content footer__content">
      <Link to="/">
        <img src={Logo} alt="logo" className="footer__logo" />
      </Link>
      <a href="mailto:support@ambrosus.io" className="footer__email">
        support@ambrosus.io
      </a>
      <div className="footer__social-icons">
        <a href="https://t.me/Ambrosus" target="_blank">
          <img
            src={TelegramIcon}
            alt="telegram-icon"
            className="footer__social-icon"
          />
        </a>
        <a href="https://blog.ambrosus.io/" target="_blank">
          <img
            src={MediumIcon}
            alt="medium icon"
            className="footer__social-icon"
          />
        </a>
        <a href="https://github.com/ambrosus" target="_blank">
          <img
            src={GithubIcon}
            alt="github-icon"
            className="footer__social-icon"
          />
        </a>
        <a
          href="https://www.linkedin.com/company/ambrosus-ecosystem"
          target="_blank"
        >
          <img
            src={LinkedInIcon}
            alt="linkedin-icon"
            className="footer__social-icon"
          />
        </a>
        <a href="https://twitter.com/AMB_Ecosystem" target="_blank">
          <img
            src={TwitterIcon}
            alt="twitter-icon"
            className="footer__social-icon"
          />
        </a>
      </div>
    </div>
  </footer>
);
