import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { utils } from 'ethers';
import git from '../assets/svg/github-icon.svg';
import clockIcon from '../assets/svg/clock.svg';
import checkIcon from '../assets/svg/check.svg';
import spinnerIcon from '../assets/svg/spinner.svg';
import IconLink from './IconLink';
import getTxLastStageStatus from '../utils/ethers/getTxLastStageStatus';
import providers, { ambChainId, ethChainId } from '../utils/providers';
import { getAllNetworks } from '../utils/networks';

const TransactionListItem = ({ tx }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(async () => {
    const receipt = await providers[tx.chainId].getTransactionReceipt(tx.hash);
    const eventId = receipt.logs[0].topics[1];

    setIsSuccess(await getTxLastStageStatus(tx.chainId, eventId));
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);

    return `${date.getDate().toString().padStart(2, '0')}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}.${date.getFullYear()}, ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  };

  const getNetworkName = (networkId) =>
    getAllNetworks().find((el) => el.chainId === networkId).name;

  const getTxLink = (isEth, hash) =>
    `${
      isEth
        ? 'https://rinkeby.etherscan.io/tx/'
        : 'https://explorer.ambrosus.com/tx/'
    }${hash}`;

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
        {!isSuccess && (
          <Link
            to={`/status/${tx.hash}`}
            className="transaction-item__view-status"
          >
            View status
          </Link>
        )}
        <div
          className={`transaction-item__status ${
            isSuccess
              ? 'transaction-item__status--checked'
              : 'transaction-item__status--loading'
          }`}
        >
          <img src={isSuccess ? checkIcon : spinnerIcon} alt="status" />
          {isSuccess ? 'Success' : 'Pending'}
        </div>
      </div>
      <div className="transaction-item__row">
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text">From:</span>
          <span className="transaction-item__black-text">
            {getNetworkName(tx.chainId)}
          </span>
          <IconLink
            href={getTxLink(tx.chainId === ethChainId, tx.hash)}
            text="txHash"
          />
        </div>
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text">To:</span>
          <span className="transaction-item__black-text">
            {getNetworkName(
              tx.chainId === ambChainId ? ethChainId : ambChainId,
            )}
          </span>
          <IconLink href={getTxLink(tx.chainId !== ethChainId)} text="txHash" />
        </div>
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text transaction-item__right">
            Amount:
          </span>
          <span className="transaction-item__black-text">
            {utils.formatUnits(tx.value, 18)} BNB.AM
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
  tx: PropTypes.object,
};

export default TransactionListItem;
