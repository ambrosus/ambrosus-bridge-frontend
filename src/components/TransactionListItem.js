import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import git from '../assets/svg/github-icon.svg';
import clockIcon from '../assets/svg/clock.svg';
import checkIcon from '../assets/svg/check.svg';
import spinnerIcon from '../assets/svg/spinner.svg';
import IconLink from './IconLink';

const TransactionListItem = ({ tx }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    return `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}, ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="transaction-item">
      <div className="transaction-item__row">
        <img src={git} alt="coin" className="transaction-item__img" />
        <span className="transaction-item__black-text">BNB.AM</span>
        <img
          src={clockIcon}
          alt="when"
          className="transaction-item__right transaction-item__clock"
        />
        <span className="transaction-item__grey-text transaction-item__time">
          {formatDate(tx.timestamp)}
        </span>
        {!tx.isSuccess && (
          <Link
            to={`/status/${tx.hash}`}
            className="transaction-item__view-status"
          >
            View status
          </Link>
        )}
        <div
          className={`transaction-item__status ${
            tx.isSuccess
              ? 'transaction-item__status--checked'
              : 'transaction-item__status--loading'
          }`}
        >
          <img src={tx.isSuccess ? checkIcon : spinnerIcon} alt="status" />
          {tx.isSuccess ? 'Success' : 'Pending'}
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
          <span className="transaction-item__black-text">
            {tx.value.toNumber()} BNB.AM
          </span>
        </div>
      </div>
      <div className="transaction-item__row">
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text">Destination:</span>
          <span className="transaction-item__black-text">
            Account c082 -
            {` ${tx.address.substring(0, 9)}...${tx.address.substring(
              tx.address.length - 9,
              tx.address.length,
            )}`}
          </span>
        </div>
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text transaction-item__right">
            Transaction fee:
          </span>
          <span className="transaction-item__black-text">≈ $0</span>
        </div>
      </div>
    </div>
  );
};

TransactionListItem.propTypes = {
  tx: PropTypes.bool,
};

export default TransactionListItem;
