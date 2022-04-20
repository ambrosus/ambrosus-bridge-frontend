import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import clockIcon from '../assets/svg/clock.svg';
import checkIcon from '../assets/svg/check.svg';
import spinnerIcon from '../assets/svg/spinner.svg';
import IconLink from './IconLink';
import getTxLastStageStatus from '../utils/ethers/getTxLastStageStatus';
import providers, { ambChainId, ethChainId } from '../utils/providers';
import { getAllNetworks } from '../utils/networks';
import createBridgeContract from '../contracts';
import getEventSignatureByName from '../utils/getEventSignatureByName';
import { tokens } from '../bridge-config.mock.json';
import getTxLink from '../utils/helpers/getTxLink';

const TransactionListItem = ({ tx }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [destinationNetTxHash, setDestinationNetTxHash] = useState(null);
  const [currentToken, setCurrentToken] = useState({});

  useEffect(async () => {
    const receipt = await providers[tx.chainId].getTransactionReceipt(tx.hash);
    const contract = createBridgeContract[tx.chainId](providers[tx.chainId]);

    const withDrawEvent = receipt.logs.find((log) =>
      log.topics.some(
        (topic) => topic === getEventSignatureByName(contract, 'Withdraw'),
      ),
    );

    const parsedData = ethers.utils.defaultAbiCoder.decode(
      ['address', 'address', 'address'],
      withDrawEvent.data,
    );
    const eventId = parsedData[2];

    const tokenAddress = parsedData[0];

    const currentCoin = Object.values(tokens).find((token) =>
      Object.values(token.addresses).some((el) => el && el === tokenAddress),
    );
    if (currentCoin) {
      setCurrentToken(currentCoin);
    }

    const lastStage = await getTxLastStageStatus(tx.chainId, eventId);
    setIsSuccess(lastStage.length);

    setDestinationNetTxHash(
      lastStage.length ? lastStage[0].transactionHash : '',
    );
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

  return (
    <div className="transaction-item">
      <div className="transaction-item__row">
        {currentToken.logo && (
          <img
            src={currentToken.logo}
            alt="coin"
            className="transaction-item__img"
          />
        )}
        <span className="transaction-item__black-text">
          {currentToken.symbol}
        </span>
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
          {destinationNetTxHash !== null &&
            (destinationNetTxHash ? (
              <IconLink
                href={getTxLink(
                  tx.chainId !== ethChainId,
                  destinationNetTxHash,
                )}
                text="txHash"
              />
            ) : (
              <span className="transaction-item__not-started">
                Transaction not started yet
              </span>
            ))}
        </div>
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text transaction-item__right">
            Amount:
          </span>
          <span className="transaction-item__black-text">
            {ethers.utils.formatUnits(tx.value, currentToken.denomination)}{' '}
            {currentToken.symbol}
          </span>
        </div>
      </div>
      <div className="transaction-item__row">
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text">Destination:</span>
          <span className="transaction-item__black-text">
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
          <span className="transaction-item__black-text">
            {ethers.utils.formatUnits(tx.gasPrice, currentToken.denomination)}{' '}
            {currentToken.symbol}
          </span>
        </div>
      </div>
    </div>
  );
};

TransactionListItem.propTypes = {
  tx: PropTypes.object,
};

export default TransactionListItem;
