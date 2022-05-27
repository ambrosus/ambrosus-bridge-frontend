/*eslint-disable*/
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { utils } from 'ethers';
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
import getTransferredTokens from '../utils/helpers/getTransferredTokens';
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
  const [minSafetyBlocks, setMinSafetyBlocks] = useState(0);
  const [transferredTokens, setTransferredTokens] = useState({
    from: '',
    to: '',
  });
  const [stagesTime, setStagesTime] = useState(null);

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

      if (provider) {
        const { current: otherProvider } = refOtherProvider;
        provider.removeAllListeners()
        otherProvider.removeAllListeners()
      }
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
      setTransferredTokens(
        getTransferredTokens(
          contract.interface.parseLog(withDrawEvent).args,
        ),
      );

      const eventId = contract.interface.parseLog(withDrawEvent).args.eventId;
      refEventId.current = eventId;

      const filter = await contract.filters.Transfer(eventId);
      const event = await contract.queryFilter(filter);
      console.log(event);
      if (+currentStage >= 2.1 && event.length) {
        currentStage = '2.2';
      }

      if (currentStage === '2.2' && confirmations === minSafetyBlocks) {
        currentStage = '3.1';
      }

      const isTransferSubmitPassed = await checkTransferSubmit();
      if (isTransferSubmitPassed) {
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

      const otherNetId = currentChainId === ambChainId ? ethChainId : ambChainId;
      const otherProvider = providers[otherNetId];

      if (currentStage === '1.1') {
        provider.on(withdraw, handleWithdraw);
      } else if (currentStage === '2.1') {
        provider.on(transfer, handleTransfer);
      } else if (currentStage === '2.2') {
        provider.on('block', handleBlock);
      } else if (currentStage === '3.1') {
        otherProvider.on(transferSubmit, handleTransferSubmit);
      } else if (currentStage === '3.2') {
        otherProvider.on(transferFinish, handleTransferFinish);
      }
    }
  }, [currentChainId])

  const handleStatus = () => {
    [ambChainId, ethChainId].forEach(async (networkId) => {
      const tx = await providers[networkId].getTransaction(txHash);

      if (tx && tx.blockNumber) {
        refContract.current = await createBridgeContract[networkId](
          providers[networkId],
        );
        const otherContract = await createBridgeContract[networkId === ambChainId ? ethChainId : ambChainId](
          providers[networkId === ambChainId ? ethChainId : ambChainId]
        );
        const secondStageTime = await otherContract.timeframeSeconds();
        const lastStageTime = await otherContract.lockTime();

        setStagesTime({
          second: secondStageTime.toNumber(),
          third: lastStageTime.toNumber(),
        });

        const minSafetyBlock = await otherContract.minSafetyBlocks();
        const safetyBlockNumber = minSafetyBlock.toNumber();
        setMinSafetyBlocks(safetyBlockNumber);

        setConfirmations(tx.confirmations > safetyBlockNumber ? safetyBlockNumber : tx.confirmations);

        if (!refProvider.current) {
          refProvider.current = providers[networkId];
        }
        if (!refOtherProvider.current) {
          refOtherProvider.current =
            providers[networkId === ambChainId ? ethChainId : ambChainId];
        }

        setCurrentChainId(networkId);
      } else if (tx && !tx.blockNumber) {
        tx.wait().then(() => {
          handleStatus();
        });
      }
    });
  };

  const checkTransferSubmit = async () => {
    const otherNetId = currentChainId === ambChainId ? ethChainId : ambChainId;

    const otherNetworkContract =
      createBridgeContract[otherNetId](refOtherProvider.current);

    const transferSubmitFilter =
      await otherNetworkContract.filters.TransferSubmit(refEventId.current);

    const transferSubmitEvent = await otherNetworkContract.queryFilter(
      transferSubmitFilter,
    );

    return transferSubmitEvent.length;
  };

  const handleBlock = async () => {
    const tx = await refProvider.current.getTransaction(txHash);
    setConfirmations(tx.confirmations > minSafetyBlocks ? minSafetyBlocks : tx.confirmations);

    if (tx.confirmations >= minSafetyBlocks) {
      await refProvider.current.removeAllListeners();
      const isTransferSubmitPassed = await checkTransferSubmit();

      if (isTransferSubmitPassed) {
        setStage('3.2');
        refOtherProvider.current.on(refFilters.current.transferFinish, handleTransferFinish);
      } else {
        refOtherProvider.current.on(refFilters.current.transferSubmit, handleTransferSubmit);
        setStage('3.1');
      }
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
      refProvider.current.removeAllListeners();
      refProvider.current.on('block', handleBlock);
    }
  };

  const handleTransferSubmit = (e) => {
    if (refStage.current === '3.1' && utils.hexZeroPad(refEventId.current.toHexString(), 32) === e.topics[1]) {
      setStage('3.2');
      refProvider.current.removeAllListeners()
      refOtherProvider.current.removeAllListeners()
      refOtherProvider.current.on(refFilters.current.transferFinish, handleTransferFinish);
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
        refOtherProvider.current.removeAllListeners()
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

  const goHome = () => history.push('/exchange');

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
        tokens={transferredTokens}
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
              {stagesTime && (
                <div className="transaction-status__timing">
                  <ClockIcon />{stagesTime.second / 60} min
                </div>
              )}
            </div>
            <p className={handleLoadingClass('2.1')}>Transaction processing.</p>
            <p className={handleLoadingClass('2.2')}>
              Confirmations
              <span className="transaction-status__info-stage-confirm">
                {+stage > 2.1 ? confirmations : 0}/{minSafetyBlocks}
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
              {stagesTime && (
                <div className="transaction-status__timing">
                  <ClockIcon />{stagesTime.third / 60} min
                </div>
              )}
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
