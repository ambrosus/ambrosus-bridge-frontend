import React from 'react';
import arrowIcon from '../assets/svg/green-arrow-right.svg';
import git from '../assets/svg/github-icon.svg';

const Confirmation = () => (
  <div className="content confirmation-page">
    <h2 className="confirmation-page__title">Confirm</h2>
    <p className="confirmation-page__amount">0.081640 ETH.AM</p>
    <div className="transaction-coins">
      <div className="transaction-coins__item">
        <img src={git} alt="coin name" className="transaction-coins__img" />
        <div className="transaction-coins__info">
          <p className="transaction-coins__title">Send:</p>
          <p className="transaction-coins__name">Ethereum</p>
        </div>
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
          <p className="transaction-coins__name">Ambrosus</p>
        </div>
      </div>
    </div>
    <div className="confirmation-info">
      <div className="confirmation-info__item">
        <span className="confirmation-info__label">Asset</span>
        <span className="confirmation-info__value">
          <img src={git} alt="ETH.AM" className="confirmation-info__img" />
          ETH.AM
        </span>
      </div>
      <div className="confirmation-info__item">
        <span className="confirmation-info__label">Estimated transfer fee</span>
        <span className="confirmation-info__value">0.0000128 ETH.AM</span>
      </div>
      <div className="confirmation-info__item">
        <span className="confirmation-info__label">Destination</span>
        <span className="confirmation-info__value">
          Account c082 - eth1ghjbjz...aksfgpa3
        </span>
      </div>
      <div className="confirmation-info__item">
        <span className="confirmation-info__label">Receiving</span>
        <span className="confirmation-info__value">0.081512 ETH.AM</span>
      </div>
    </div>
    <div className="confirmation-page__btns-wrapper">
      <button
        type="button"
        className="button button_gray confirmation-page__btn"
      >
        Back
      </button>
      <button
        type="button"
        className="button button_black confirmation-page__btn"
      >
        Confirm
      </button>
    </div>
  </div>
);

export default Confirmation;
