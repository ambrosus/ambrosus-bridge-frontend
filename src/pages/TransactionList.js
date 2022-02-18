import React from 'react';
import git from '../assets/svg/github-icon.svg';
import clockIcon from '../assets/svg/clock.svg';
import checkIcon from '../assets/svg/check.svg';
import IconLink from '../components/IconLink';

const TransactionList = () => (
  <div className="content transaction-list">
    <div className="transaction-item">
      <div className="transaction-item__row">
        <img src={git} alt="coin" className="transaction-item__img" />
        <span className="transaction-item__black-text">BNB.AM</span>
        <img
          src={clockIcon}
          alt="when"
          className="transaction-item__right transaction-item__clock"
        />
        <span className="transaction-item__grey-text">
          5 seconds ago (01.02.2022, 18:02:13)
        </span>
        <div className="transaction-item__status">
          <img src={checkIcon} alt="check" />
          Success
        </div>
      </div>
      <div className="transaction-item__row">
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text">From:</span>
          <span className="transaction-item__black-text">
            Binance Smart Chain
          </span>
          <IconLink href="/" />
        </div>
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text">To:</span>
          <span className="transaction-item__black-text">Ambrosus</span>
          <IconLink href="/" />
        </div>
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text transaction-item__right">
            Amount:
          </span>
          <span className="transaction-item__black-text">0.813150 BNB.AM</span>
        </div>
      </div>
      <div className="transaction-item__row">
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text">Destination:</span>
          <span className="transaction-item__black-text">
            Account c082 - eth1ghjbjz...aksfgpa3
          </span>
        </div>
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text transaction-item__right">
            Transaction fee:
          </span>
          <span className="transaction-item__black-text">≈ $1.00</span>
        </div>
      </div>
    </div>
  </div>
);

export default TransactionList;
