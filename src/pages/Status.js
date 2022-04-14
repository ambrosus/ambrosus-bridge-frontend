import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link, useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import TransactionCoins from '../components/TransactionCoins';
import { ReactComponent as ClockIcon } from '../assets/svg/clock.svg';
import warningImg from '../assets/svg/warning.svg';
import providers, { ambChainId, ethChainId } from '../utils/providers';
import createBridgeContract, {
  ambContractAddress,
  ethContractAddress,
} from '../contracts';
import getTxLastStageStatus from '../utils/ethers/getTxLastStageStatus';
import getEventSignatureByName from '../utils/getEventSignatureByName';

const withDrawName = 'Withdraw';
const transferName = 'Transfer';

const Status = () => {
  const { txHash } = useParams();
  const history = useHistory();

  const [currentChainId, setCurrentChainId] = useState(0);
  const [stage, setStage] = useState('1.1');
  const [confirmations, setConfirmations] = useState(0);
  const [otherNetworkTxHash, setOtherNetworkTxHash] = useState('');

  useEffect(() => {
    handleStatus();
  }, []);

  const handleStatus = () => {
    [ambChainId, ethChainId].forEach(async (networkId) => {
      const tx = await providers[networkId].getTransaction(txHash);

      if (tx && tx.blockNumber) {
        setCurrentChainId(tx.chainId);
        let currentStage = stage;

        const smartContractAddress =
          networkId === ethChainId ? ethContractAddress : ambContractAddress;

        const receipt = await providers[tx.chainId].getTransactionReceipt(
          txHash,
        );

        if (![ambContractAddress, ethContractAddress].includes(receipt.to)) {
          history.push('/');
        }

        const contract = createBridgeContract[networkId](providers[networkId]);

        const withDrawEvent = receipt.logs.find((log) =>
          log.topics.some((topic) => topic === getEventSignatureByName(contract, withDrawName)),
        );

        if (withDrawEvent) {
          currentStage = '2.1';
        }
        const eventId = ethers.utils.defaultAbiCoder.decode(['address'], withDrawEvent.data)[0];
        const filter = await contract.filters.Transfer(eventId);
        const event = await contract.queryFilter(filter);

        if (+currentStage >= 2.1 && event.length) {
          setOtherNetworkTxHash(event[0].transactionHash);
          currentStage = '3.1';
        }
        const transferSubmitFilter = await contract.filters.TransferSubmit(eventId);
        const transferSubmitEvent = await contract.queryFilter(transferSubmitFilter);

        if (+currentStage >= 3.1 && transferSubmitEvent.length) {
          currentStage = '3.2'
        }

        if (+currentStage >= 3.2 && await getTxLastStageStatus(tx.chainId, eventId)) {
          console.log(getTxLastStageStatus(tx.chainId, eventId));
          currentStage = '4';
        }

        setStage(currentStage);
        setConfirmations(tx.confirmations > 10 ? 10 : tx.confirmations);
        eventsHandler(networkId, smartContractAddress, contract);
      } else if (tx && !tx.blockNumber) {
        tx.wait().then(() => handleStatus());
      }
    });
  };

  const eventsHandler = (networkId, address, contract) => {
    providers[networkId].on('block', async () => {
      const tx = await providers[networkId].getTransaction(txHash);
      setConfirmations(tx.confirmations > 10 ? 10 : tx.confirmations);
    });

    const firstStageFilter = {
      address,
      topics: [getEventSignatureByName(contract, withDrawName)],
    };

    providers[networkId].on(firstStageFilter, () => {
      if (+stage < 2) {
        setStage('2.1');
      }
    });

    const currentNetworkFilter = {
      address,
      topics: [getEventSignatureByName(contract, transferName)],
    };

    providers[networkId].on(currentNetworkFilter, () => {
      if (+stage < 3) {
        setStage('3.1');
      }
    });

    const otherContractAddress =
      networkId === ethChainId ? ambContractAddress : ethContractAddress;

    const otherNetworkFilter = {
      otherContractAddress,
      topics: [getEventSignatureByName(contract, transferName)],
    };

    providers[networkId === ambChainId ? ethChainId : ambChainId].on(
      otherNetworkFilter,
      () => {
        if (+stage < 4 && +stage > 3) {
          setStage('2.1');
        }
      },
    );
  };

  const handleLoadingClass = (currentStage, isMainLoader = false) => {
    const elClass = isMainLoader
      ? 'transaction-status__img'
      : 'transaction-status__info-stage';

    let conditionalClass = '';

    const bufferStage = isMainLoader ? stage.split('.')[0] : +stage;
    const bufferCurrentStage = isMainLoader
      ? currentStage.split('.')[0]
      : +currentStage;

    if (bufferStage > bufferCurrentStage) {
      conditionalClass = `${elClass}--checked`;
    } else if (bufferStage === bufferCurrentStage) {
      conditionalClass = `${elClass}--loading`;
    }

    return `${elClass} ${conditionalClass}`;
  };

  let conditionalConfClass = '';

  if (+stage > 2.1) {
    if (confirmations === 10) {
      conditionalConfClass = 'transaction-status__info-stage--checked';
    } else if (confirmations < 10 && +stage > 2.1) {
      conditionalConfClass = 'transaction-status__info-stage--loading';
    }
  }

  const confirmationClass = `transaction-status__info-stage ${conditionalConfClass}`;

  return (
    <div className="content status-page">
      <h2 className="status-page__title">Transaction in progress</h2>
      <p className="status-page__subtitle">
        Please wait some time for transactions to finish
      </p>
      <TransactionCoins
        selectedChainId={currentChainId}
        fromHash={txHash}
        toHash={otherNetworkTxHash || 'Transaction not started yet'}
      />
      <hr />
      <div className="transaction-status">
        <div className="transaction-status__item">
          <div className={handleLoadingClass('1.0', true)}>
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
            <p className={handleLoadingClass('1.1')}>Pending transaction.</p>
            <p className={handleLoadingClass('1.2')}>Transaction completed.</p>
          </div>
        </div>
        <div className="transaction-status__item">
          <div className={handleLoadingClass('2.0', true)}>
            <div className="transaction-status__img-icon" />
          </div>
          <div className="transaction-status__item-info">
            <div className="transaction-status__item-title">
              <p className="transaction-status__stage">Stage 2</p>
              <div className="transaction-status__timing">
                <ClockIcon />4 hour
              </div>
            </div>
            <p className={handleLoadingClass('2.1')}>Transaction processing.</p>
            <p className={confirmationClass}>
              Confirmations
              <span className="transaction-status__info-stage-confirm">
                {+stage > 2.1 ? confirmations : 0}/10
              </span>
            </p>
          </div>
        </div>
        <div className="transaction-status__item">
          <div className={handleLoadingClass('3.0', true)}>
            <div className="transaction-status__img-icon" />
          </div>
          <div className="transaction-status__item-info">
            <div className="transaction-status__item-title">
              <p className="transaction-status__stage">Stage 3</p>
              <div className="transaction-status__timing">
                <ClockIcon />4 hour
              </div>
            </div>
            <p className={handleLoadingClass('3.1')}>Pending transaction.</p>
            <p className={handleLoadingClass('3.2')}>Pending transaction.</p>
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
        <Link
          to="/history"
          type="button"
          className="button button_black btns-wrapper__btn"
        >
          Transaction history
        </Link>
      </div>
    </div>
  );
};

export default Status;
