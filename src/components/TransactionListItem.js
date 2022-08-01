import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import clockIcon from '../assets/svg/clock.svg';
import checkIcon from '../assets/svg/check.svg';
import spinnerIcon from '../assets/svg/spinner.svg';
import IconLink from './IconLink';
import getTxLastStageStatus from '../utils/ethers/getTxLastStageStatus';
import providers, { ambChainId } from '../utils/providers';
import { getNetworkByChainId } from '../utils/networks';
import { createBridgeContract } from '../contracts';
import getEventSignatureByName from '../utils/getEventSignatureByName';
import getTxLink from '../utils/helpers/getTxLink';
import getTransferredTokens from '../utils/helpers/getTransferredTokens';
import useBridges from '../hooks/useBridges';
import { getDestinationNet } from '../utils/helpers/getDestinationNet';
import ConfigContext from '../contexts/ConfigContext/context';

// TODO: eslint enable
/*eslint-disable*/

const TransactionListItem = ({ tx }) => {
  const bridges = useBridges();
  const { tokens } = useContext(ConfigContext);

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
    const eventId = withdrawData.args.eventId;
    const tokenAddress = withdrawData.args['tokenTo'];

    setTransferredTokens(getTransferredTokens(withdrawData.args, tokens));
    setTokenAmount(withdrawData.args.amount);

    const currentCoin = tokens.find((token) => token.address === tokenAddress);
    console.log(tokens, tx);
    if (currentCoin) {
      setCurrentToken(currentCoin);
    }
    const destNetId = getDestinationNet(tx.to, bridges);
    const otherContractAddress = Object.values(
      bridges[
        destNetId === ambChainId
          ? tx.chainId
          : destNetId
        ],
    ).find((el) => el !== tx.to);

    const lastStage = await getTxLastStageStatus(getDestinationNet(tx.to, bridges), eventId, otherContractAddress);
    setIsSuccess(lastStage.length);

    setDestinationNetTxHash(
      lastStage.length ? lastStage[0].transactionHash : '',
    );
  }, []);

  const getEventData = async (eventName) => {
    const receipt = await providers[tx.chainId].getTransactionReceipt(tx.hash);
    const contract = createBridgeContract(
      tx.to,
      providers[tx.chainId],
    );

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

  const getNetworkName = (chainId) => getNetworkByChainId(+chainId).name;

  return (
    <div className="transaction-item">
      <div className="transaction-item__row">
        {transferredTokens.from && (
          <>
            <img
              src={
                currentToken.logo
              }
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
            {!!tx.chainId && getNetworkName(tx.chainId)}
          </span>
          <IconLink
            href={getTxLink(tx.chainId, tx.hash)}
            text="txHash"
          />
        </div>
        <div className="transaction-item__mobile-row">
          <span className="transaction-item__grey-text">To:</span>
          <span className="transaction-item__black-text">
            {getNetworkName(
              getDestinationNet(tx.to, bridges),
            )}
          </span>
          {destinationNetTxHash !== null &&
            (destinationNetTxHash ? (
              <IconLink
                href={getTxLink(
                  +getDestinationNet(tx.to, bridges),
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
            {transferredTokens.from}
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
            {ethers.utils.formatUnits(
              tx.args['transferFeeAmount'].add(tx.args['bridgeFeeAmount']),
              currentToken.denomination,
            )}{' '}
            {getNetworkByChainId(tx.chainId).code}
          </span>
        </div>
      </div>
      <div className="transaction-item__row">
        <span className="transaction-item__grey-text">Transferred tokens:</span>
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
