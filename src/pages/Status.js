import React from 'react';
import TransactionCoins from '../components/TransactionCoins';
import { ReactComponent as ClockIcon } from '../assets/svg/clock.svg';
import warningImg from '../assets/svg/warning.svg';

const Status = () => (
  <div className="content status-page">
    <h2 className="status-page__title">Transaction in progress</h2>
    <p className="status-page__subtitle">
      Please wait some time for transactions to finish
    </p>
    <TransactionCoins
      from="Ethereum"
      to="Ambrosus"
      fromHash="0x8352fdc12340e8288274af152d70x8352fdc12340e8288274af152d7"
      toHash="0x8352fdc12340e8288274af152d70x8352fdc12340e8288274af152d7"
    />
    <hr />
    <div className="transaction-status">
      <div className="transaction-status__item">
        <div className="transaction-status__img transaction-status__img--checked">
          <div className="transaction-status__img-icon" />
        </div>
        <div className="transaction-status__item-info">
          <div className="transaction-status__item-title">
            <p className="transaction-status__stage">Stage 1</p>
            <div className="transaction-status__timing">
              <ClockIcon />
              1-5 min
            </div>
          </div>
          <p className="transaction-status__info-stage transaction-status__info-stage--check">
            Pending transaction.
          </p>
          <p className="transaction-status__info-stage transaction-status__info-stage--loading">
            Transaction completed.
          </p>
          <p className="transaction-status__info-stage">
            Confirmations
            <span className="transaction-status__info-stage-confirm">0/10</span>
          </p>
        </div>
      </div>
      <div className="transaction-status__item">
        <div className="transaction-status__img transaction-status__img--loading">
          <div className="transaction-status__img-icon" />
        </div>
        <div className="transaction-status__item-info">
          <div className="transaction-status__item-title">
            <p className="transaction-status__stage">Stage 2</p>
            <div className="transaction-status__timing">
              <ClockIcon />4 hour
            </div>
          </div>
          <p className="transaction-status__info-stage transaction-status__info-stage--loading">
            Transaction processing.
          </p>
        </div>
      </div>
      <div className="transaction-status__item">
        <div className="transaction-status__img">
          <div className="transaction-status__img-icon" />
        </div>
        <div className="transaction-status__item-info">
          <div className="transaction-status__item-title">
            <p className="transaction-status__stage">Stage 3</p>
            <div className="transaction-status__timing">
              <ClockIcon />4 hour
            </div>
          </div>
          <p className="transaction-status__info-stage transaction-status__info-stage--loading">
            Pending transaction.
          </p>
          <p className="transaction-status__info-stage">
            Transaction completed.
          </p>
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
    <div className="btns-wrapper btns-wrapper--right">
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
