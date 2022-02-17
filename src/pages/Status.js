import React from 'react';
import TransactionCoins from '../components/TransactionCoins';
import { ReactComponent as ChecksIcon } from '../assets/svg/checks.svg';
import { ReactComponent as PlusIcon } from '../assets/svg/plus-circle.svg';
import { ReactComponent as UpdatingIcon } from '../assets/svg/updating.svg';
import { ReactComponent as ClockIcon } from '../assets/svg/clock.svg';
import { ReactComponent as ArrowIcon } from '../assets/svg/green-arrow-right.svg';
import warningImg from '../assets/svg/warning.svg';

const Status = () => (
  <div className="content status-page">
    <h2 className="status-page__title">Transaction in progress</h2>
    <p className="status-page__subtitle">
      Please wait some time for transactions to finish
    </p>
    <TransactionCoins from="Ethereum" to="Ambrosus" link="/" />
    <hr />
    <div className="transaction-status">
      <div className="transaction-status__item">
        <div className="transaction-status__img transaction-status__img--selected">
          <PlusIcon />
        </div>
        <p className="transaction-status__text">
          Creating / mining a transaction in the sender network
        </p>
        <div className="transaction-status__timing">
          <ClockIcon />
          1-5 min
        </div>
      </div>
      <div className="transaction-status__arrow">
        <ArrowIcon />
      </div>
      <div className="transaction-status__item">
        <div className="transaction-status__img">
          <UpdatingIcon />
        </div>
        <p className="transaction-status__text">
          Creating / mining a transaction in the sender network
        </p>
        <div className="transaction-status__timing">
          <ClockIcon />
          1-5 min
        </div>
      </div>
      <div className="transaction-status__arrow">
        <ArrowIcon />
      </div>
      <div className="transaction-status__item">
        <div className="transaction-status__img">
          <ChecksIcon />
        </div>
        <p className="transaction-status__text">
          Creating / mining a transaction in the sender network
        </p>
        <div className="transaction-status__timing">
          <ClockIcon />
          1-5 min
        </div>
      </div>
    </div>
    <div className="warning-block">
      <img src={warningImg} alt="warning" />
      <span className="warning-block__text">
        Funds can be credited to your account from 5 minutes to 4 hours, wait
        for a confirmation of your funds
      </span>
    </div>
    <div className="btns-wrapper">
      <button type="button" className="button button_gray btns-wrapper__btn">
        Go to home
      </button>
      <button type="button" className="button button_black btns-wrapper__btn">
        Transaction history
      </button>
    </div>
  </div>
);

export default Status;
