import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
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
import getTransferredTokens from '../utils/helpers/getTransferredTokens';
/*eslint-disable*/
const TransactionListItem = ({ tx }) => {
  const { account } = useWeb3React();

  const [isSuccess, setIsSuccess] = useState(false);
  const [destinationNetTxHash, setDestinationNetTxHash] = useState(null);
  const [currentToken, setCurrentToken] = useState({});
  const [tokenAmount, setTokenAmount] = useState(0);
  const [transferredTokens, setTransferredTokens] = useState({
    from: '',
    to: '',
  });

  useEffect(async () => {
    const withdrawData = await getEventData('Withdraw');
    const transferData = await getEventData('Transfer');
    const eventId = withdrawData.args.eventId;
    const tokenAddress = withdrawData.args['tokenTo'];

    setTransferredTokens(getTransferredTokens(withdrawData.args, tx.chainId));

    if (transferData) {
      const correctTransfer = transferData.args.queue.find(
        (el) => el.toAddress === account,
      );
      setTokenAmount(correctTransfer.amount);
    }

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

  const getEventData = async (eventName) => {
    const receipt = await providers[tx.chainId].getTransactionReceipt(tx.hash);
    const contract = createBridgeContract[tx.chainId](providers[tx.chainId]);

    const eventData = receipt.logs.find((log) =>
      log.topics.some(
        (topic) => topic === getEventSignatureByName(contract, eventName),
      ),
    );
    if (eventData) {
      return contract.interface.parseLog(eventData);
    }
    return null;
  };

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
        {transferredTokens.from && (
          <>
            <img
              src={transferredTokens.from.toLowerCase().includes('amb') ? tokens.SAMB.logo : tokens.WETH.logo}
              alt="coin"
              className="transaction-item__img"
            />
            <span className="transaction-item__black-text">
              {transferredTokens.from}
            </span>
          </>
        )}
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
            {ethers.utils.formatUnits(tokenAmount, currentToken.denomination)}{' '}
            {currentToken.symbol}
          </span>
        </div>
      </div>
      <div className="transaction-item__row">
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text">Destination:</span>
          <span className="transaction-item__black-text">
            {` ${tx.from.substring(0, 9)}...${tx.from.substring(
              tx.from.length - 9,
              tx.from.length,
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
      <div className="transaction-item__row">
        <span className="transaction-item__grey-text">
          Transferred tokens:
        </span>
        <span className="transaction-item__black-text">
          {`${transferredTokens.from} - ${transferredTokens.to}`}
        </span>
      </div>
    </div>
  );
};

TransactionListItem.propTypes = {
  tx: PropTypes.object,
};

export default TransactionListItem;
