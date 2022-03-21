import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import TransactionCoins from '../components/TransactionCoins';
import { ReactComponent as ClockIcon } from '../assets/svg/clock.svg';
import warningImg from '../assets/svg/warning.svg';
import providers from '../utils/providers';
import { abi } from '../utils/abi';

const networkIds = [4, 30741];
const ethContractAddress = '0x7727F5e11D7b628f3D7215a113423151C43C7772';
const ambContractAddress = '0xc5bBbF47f604adFDB7980BFa6115CfdBF992413c';
const withDrawTitle = 'Withdraw(address,uint256)';
const transferTitle = 'Transfer(address,address,uint256)';

const Status = () => {
  const { txHash } = useParams();

  const [stage, setStage] = useState('1.1');
  const [confirmations, setConfirmations] = useState(0);
  const [otherNetworkTxHash, setOtherNetworkTxHash] = useState('');

  useEffect(() => {
    networkIds.forEach(async (networkId) => {
      const tx = await providers[networkId].getTransaction(txHash);

      if (tx) {
        let currentStage = stage;

        const smartContractAddress =
          networkId === 4 ? ethContractAddress : ambContractAddress;

        const receipt = await providers[tx.chainId].getTransactionReceipt(
          txHash,
        );

        const isFirstStagePassed = receipt.logs.some((log) =>
          log.topics.some((topic) => topic === ethers.utils.id(withDrawTitle)),
        );

        if (isFirstStagePassed) {
          currentStage = '2.1';
        }

        const eventId = receipt.logs[0].topics[1];

        const contract = getContract(networkId, smartContractAddress);
        const filter = await contract.filters.Transfer(eventId);
        const event = await contract.queryFilter(filter);

        if (event) {
          setOtherNetworkTxHash(event[0].transactionHash);
          currentStage = '3.1';
        }

        const otherNetworkContract = getContract(
          networkIds.find((el) => el !== tx.chainId),
          smartContractAddress,
        );

        const otherNetworkFilter = await otherNetworkContract.filters.Transfer(
          eventId,
        );
        const otherNetworkEvent = await otherNetworkContract.queryFilter(
          otherNetworkFilter,
        );

        if (otherNetworkEvent.length) {
          currentStage = '4';
        }

        setStage(currentStage);
        setConfirmations(tx.confirmations > 10 ? 10 : tx.confirmations);
        eventsHandler(networkId, smartContractAddress);
      }
    });
  }, []);

  const eventsHandler = (networkId, address) => {
    const firstStageFilter = {
      address,
      topics: [ethers.utils.id(withDrawTitle)],
    };

    providers[networkId].on(firstStageFilter, () => {
      if (+stage < 2) {
        setStage('2.1');
      }
    });

    const currentNetworkFilter = {
      address,
      topics: [ethers.utils.id(transferTitle)],
    };

    providers[networkId].on(currentNetworkFilter, () => {
      if (+stage < 3) {
        setStage('3.1');
      }
    });

    const otherContractAddress =
      networkId === 4 ? ambContractAddress : ethContractAddress;
    const otherNetworkFilter = {
      otherContractAddress,
      topics: [ethers.utils.id(transferTitle)],
    };

    providers[networkIds.find((el) => el !== networkId)].on(
      otherNetworkFilter,
      () => {
        if (+stage < 4 && +stage > 3) {
          setStage('2.1');
        }
      },
    );
  };

  const getContract = (networkId, address) =>
    new ethers.Contract(address, abi, providers[networkId]);

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

  if (confirmations === 10) {
    conditionalConfClass = 'transaction-status__info-stage--checked';
  } else if (confirmations < 10 && +stage > 2.1) {
    conditionalConfClass = 'transaction-status__info-stage--loading';
  }

  const confirmationClass = `transaction-status__info-stage ${conditionalConfClass}`;

  return (
    <div className="content status-page">
      <h2 className="status-page__title">Transaction in progress</h2>
      <p className="status-page__subtitle">
        Please wait some time for transactions to finish
      </p>
      <TransactionCoins
        from="Ethereum"
        to="Ambrosus"
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
                {confirmations}/10
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
        <button type="button" className="button button_black btns-wrapper__btn">
          Transaction history
        </button>
      </div>
    </div>
  );
};

export default Status;
