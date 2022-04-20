import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { Link, useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import TransactionNetworks from '../components/TransactionNetworks';
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
const transferSubmitName = 'TransferSubmit';
const transferFinishName = 'TransferFinish';

const Status = () => {
  const { txHash } = useParams();
  const history = useHistory();

  const [currentChainId, setCurrentChainId] = useState(0);
  const [stage, setStage] = useState('1.1');
  const [confirmations, setConfirmations] = useState(0);
  const [otherNetworkTxHash, setOtherNetworkTxHash] = useState('');

  const refStage = useRef(stage);

  useEffect(() => {
    handleStatus();
  }, []);

  useEffect(() => {
    refStage.current = stage;
  }, [stage]);

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

        console.log('tx:', tx, 'receipt:', receipt);

        if (![ambContractAddress, ethContractAddress].includes(receipt.to)) {
          history.push('/');
        }

        const contract = createBridgeContract[networkId](providers[networkId]);

        const withDrawEvent = receipt.logs.find((log) =>
          log.topics.some(
            (topic) =>
              topic === getEventSignatureByName(contract, withDrawName),
          ),
        );
        console.log(withDrawEvent);
        if (withDrawEvent) {
          currentStage = '2.1';
        }
        const eventId = ethers.utils.defaultAbiCoder.decode(
          ['address', 'address', 'address'],
          withDrawEvent.data,
        )[2];
        console.log(eventId);
        const filter = await contract.filters.Transfer(eventId);
        const event = await contract.queryFilter(filter);

        if (+currentStage >= 2.1 && event.length) {
          currentStage = '3.1';
        }

        const otherNetId = tx.chainId === ambChainId ? ethChainId : ambChainId;
        const otherProvider = providers[otherNetId];

        const otherNetworkContract =
          createBridgeContract[otherNetId](otherProvider);

        const transferSubmitFilter =
          await otherNetworkContract.filters.TransferSubmit(eventId);

        const transferSubmitEvent = await otherNetworkContract.queryFilter(
          transferSubmitFilter,
        );

        if (+currentStage >= 3.1 && transferSubmitEvent.length) {
          currentStage = '3.2';
        }

        const lastTx = await getTxLastStageStatus(tx.chainId, eventId);

        if (+currentStage >= 3.2 && lastTx.length) {
          currentStage = '4';
          setOtherNetworkTxHash(lastTx[0].transactionHash);
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
    const handleBlock = async () => {
      const tx = await providers[networkId].getTransaction(txHash);
      setConfirmations(tx.confirmations > 10 ? 10 : tx.confirmations);

      if (tx.confirmations >= 10) {
        providers[networkId].off('block', handleBlock);
      }
    };
    providers[networkId].on('block', handleBlock);

    const firstStageFilter = {
      address,
      topics: [getEventSignatureByName(contract, withDrawName)],
    };

    const { current } = refStage;

    const handleWithdraw = () => {
      setStage('2.1');
      providers[networkId].off(firstStageFilter, handleWithdraw);
    };

    if (current === '1.1') {
      providers[networkId].on(firstStageFilter, handleWithdraw);
    }

    const currentNetworkFilter = {
      address,
      topics: [getEventSignatureByName(contract, transferName)],
    };

    const handleTransfer = () => {
      if (current === '2.1') {
        setStage('3.1');
        providers[networkId].off(currentNetworkFilter, handleTransfer);
      }
    };
    providers[networkId].on(currentNetworkFilter, handleTransfer);

    const otherContractAddress =
      networkId === ethChainId ? ambContractAddress : ethContractAddress;

    const otherNetworkSubmitFilter = {
      address: otherContractAddress,
      topics: [getEventSignatureByName(contract, transferSubmitName)],
    };

    const otherProvider =
      providers[networkId === ambChainId ? ethChainId : ambChainId];

    const handleTransferSubmit = () => {
      if (current === '3.1') {
        setStage('3.2');
        otherProvider.off(otherNetworkSubmitFilter, handleTransferSubmit);
      }
    };
    otherProvider.on(otherNetworkSubmitFilter, handleTransferSubmit);

    const otherNetworkFinishFilter = {
      address: otherContractAddress,
      topics: [getEventSignatureByName(contract, transferFinishName)],
    };

    const handleTransferFinish = () => {
      if (current === '3.2') {
        setStage('4');
        otherProvider.off(otherNetworkFinishFilter, handleTransferFinish);
      }
    };
    otherProvider.on(otherNetworkFinishFilter, handleTransferFinish);
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
    } else if (confirmations < 10) {
      conditionalConfClass = 'transaction-status__info-stage--loading';
    }
  }

  const goHome = () => history.push('/exchange');
  const confirmationClass = `transaction-status__info-stage ${conditionalConfClass}`;

  return (
    <div className="content status-page">
      <h2 className="status-page__title">Transaction in progress</h2>
      <p className="status-page__subtitle">
        Please wait some time for transactions to finish
      </p>
      <TransactionNetworks
        selectedChainId={currentChainId}
        fromHash={txHash}
        toHash={otherNetworkTxHash || null}
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
            <p className={handleLoadingClass('3.2')}>Transaction finish.</p>
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
        <button
          onClick={goHome}
          type="button"
          className="button button_gray btns-wrapper__btn"
        >
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
