import React from 'react';
import PropTypes from 'prop-types';
import git from '../assets/svg/github-icon.svg';
import arrowIcon from '../assets/svg/green-arrow-right.svg';
import linkIcon from '../assets/svg/link.svg';

const TransactionCoins = ({ from, to, link }) => (
  <div className="transaction-coins">
    <div className="transaction-coins__item">
      <img src={git} alt="coin name" className="transaction-coins__img" />
      <div className="transaction-coins__info">
        <p className="transaction-coins__title">Send:</p>
        <p className="transaction-coins__name">{from}</p>
      </div>
      {link && (
        <a href={link} className="transaction-coins__link">
          <img src={linkIcon} alt="explorer" />
          Explorer
        </a>
      )}
    </div>
    <img
      src={arrowIcon}
      alt="arrow right"
      className="transaction-coins__arrow"
    />
    <div className="transaction-coins__item">
      <img src={git} alt="coin name" className="transaction-coins__img" />
      <div className="transaction-coins__info">
        <p className="transaction-coins__title">To:</p>
        <p className="transaction-coins__name">{to}</p>
      </div>
    </div>
  </div>
);

TransactionCoins.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  link: PropTypes.string,
};

export default TransactionCoins;
