/*eslint-disable*/
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useHistory } from 'react-router';
import { Link, useParams } from 'react-router-dom';
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
  const refEventId = useRef('');
  const refProvider = useRef(null);
  const refContract = useRef(null);
  const refOtherProvider = useRef(null);
  const refFilters = useRef({});

  const filtersForEvents = async () => {
    const { current: contract } = refContract;
    const address = currentChainId === ethChainId ? ethContractAddress : ambContractAddress;
    const otherContractAddress = currentChainId !== ethChainId ? ethContractAddress : ambContractAddress;

    refFilters.current = {
      withdraw: {
        address,
        topics: [getEventSignatureByName(contract, withDrawName)],
      },
      transfer: {
        address,
        topics: [getEventSignatureByName(contract, transferName)],
      },
      transferSubmit: {
        address: otherContractAddress,
        topics: [getEventSignatureByName(contract, transferSubmitName)],
      },
      transferFinish: {
        address: otherContractAddress,
        topics: [getEventSignatureByName(contract, transferFinishName)],
      },
    };
  };

  useEffect(() => {
    setTimeout(handleStatus, 2000);

    return async () => {
      clearTimeout(handleStatus);

      const { current: provider } = refProvider;
      const { current: otherProvider } = refOtherProvider;
      const { withdraw, transfer, transferSubmit, transferFinish } = refFilters.current;

      provider.off('block', handleBlock);
      provider.off(withdraw, handleWithdraw);
      provider.off(transfer, handleTransfer);
      otherProvider.off(transferSubmit, handleTransferSubmit);
      otherProvider.off(transferFinish, handleTransferFinish);
    }
  }, []);

  useEffect(() => {
    refStage.current = stage;
  }, [stage]);

  useEffect(async () => {
    if (currentChainId) {
      let currentStage = stage;

      const receipt = await providers[currentChainId].getTransactionReceipt(txHash);

      if (![ambContractAddress, ethContractAddress].includes(receipt.to)) {
        history.push('/');
      }

      refContract.current = await createBridgeContract[currentChainId](
        providers[currentChainId],
      );

      const { current: contract } = refContract;

      const withDrawEvent = receipt.logs.find((log) =>
        log.topics.some(
          (topic) =>
            topic === getEventSignatureByName(contract, withDrawName),
        ),
      );
      if (withDrawEvent) {
        currentStage = '2.1';
      }

      const eventId = contract.interface.parseLog(withDrawEvent).args.eventId;
      refEventId.current = eventId;

      const filter = await contract.filters.Transfer(eventId);
      const event = await contract.queryFilter(filter);

      if (+currentStage >= 2.1 && event.length) {
        currentStage = '3.1';
      }

      const otherNetId = currentChainId === ambChainId ? ethChainId : ambChainId;
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

      const lastTx = await getTxLastStageStatus(currentChainId, eventId);

      if (+currentStage >= 3.2 && lastTx.length) {
        currentStage = '4';
        setOtherNetworkTxHash(lastTx[0].transactionHash);
      }
      setStage(currentStage);

      const { current: provider } = refProvider;
      await filtersForEvents();
      const { withdraw, transfer, transferSubmit, transferFinish } = refFilters.current;

      provider.on('block', handleBlock);
      provider.on(withdraw, handleWithdraw);
      provider.on(transfer, handleTransfer);
      otherProvider.on(transferSubmit, handleTransferSubmit);
      otherProvider.on(transferFinish, handleTransferFinish);
    }
  }, [currentChainId])

  const handleStatus = () => {
    [ambChainId, ethChainId].forEach(async (networkId) => {
      const tx = await providers[networkId].getTransaction(txHash);

      if (tx && tx.blockNumber) {
        refProvider.current = providers[networkId];
        refOtherProvider.current =
          providers[currentChainId === ambChainId ? ethChainId : ambChainId];

        setCurrentChainId(networkId);
        setConfirmations(tx.confirmations > 10 ? 10 : tx.confirmations);
      } else if (tx && !tx.blockNumber) {
        tx.wait().then(() => {
          handleStatus();
        });
      }
    });
  };

  const handleBlock = async () => {
    const tx = await refProvider.current.getTransaction(txHash);
    setConfirmations(tx.confirmations > 10 ? 10 : tx.confirmations);

    if (tx.confirmations >= 10) {
      refProvider.current.off('block', handleBlock);
    }
  };

  const handleWithdraw = () => {
    if (refStage.current === '1.1') {
      setStage('2.1');
      refProvider.current.off(refFilters.current.withdraw, handleWithdraw);
    }
  };

  const handleTransfer = () => {
    if (refStage.current === '2.1') {
      setStage('3.1');
      refProvider.current.off(refFilters.current.transfer, handleTransfer);
    }
  };

  const handleTransferSubmit = (e) => {
    console.log(e);
    if (refStage.current === '3.1') {
      setStage('3.2');
      refOtherProvider.current.off(refFilters.current.transferSubmit, handleTransferSubmit);
    }
  };

  const handleTransferFinish = async () => {
    if (refStage.current === '3.2') {
      const lastTx = await getTxLastStageStatus(
        currentChainId,
        refEventId.current,
      );
      if (lastTx.length) {
        setStage('4');
        setOtherNetworkTxHash(lastTx[0].transactionHash);
        refOtherProvider.current.off(refFilters.current.transferFinish, handleTransferFinish);
      }
    }
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
