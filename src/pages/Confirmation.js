import React from 'react';
import git from '../assets/svg/github-icon.svg';
import TransactionCoins from '../components/TransactionCoins';

const Confirmation = () => (
  <div className="content confirmation-page">
    <h2 className="confirmation-page__title">Confirm</h2>
    <p className="confirmation-page__amount">0.081640 ETH.AM</p>
    <TransactionCoins from="Ethereum" to="Ambrosus" />
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
    <div className="btns-wrapper">
      <button type="button" className="button button_gray btns-wrapper__btn">
        Back
      </button>
      <button type="button" className="button button_black btns-wrapper__btn">
        Confirm
      </button>
    </div>
  </div>
);

export default Confirmation;
