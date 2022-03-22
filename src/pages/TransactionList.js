import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import git from '../assets/svg/github-icon.svg';
import clockIcon from '../assets/svg/clock.svg';
import spinnerIcon from '../assets/svg/spinner.svg';
import checkIcon from '../assets/svg/check.svg';
import IconLink from '../components/IconLink';
import providers, { ambChainId, ethChainId } from '../utils/providers';
import { abi } from '../utils/abi';

const TransactionList = () => {
  const { account } = useWeb3React();
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    getHistory(ethChainId);
    getHistory(ambChainId);
  }, []);

  const getHistory = (networkId) => {
    const provider = providers[networkId];
    const contract = new ethers.Contract(
      networkId === ethChainId
        ? '0x7727F5e11D7b628f3D7215a113423151C43C7772'
        : '0xc5bBbF47f604adFDB7980BFa6115CfdBF992413c',
      abi,
      provider,
    );
    contract
      .queryFilter(contract.filters.Withdraw(account))
      .then((response) => {
        response.forEach(async (el) => {
          const { timestamp } = await el.getBlock();

          el.getTransaction().then((trans) => {
            const isSuccess = false;
            console.log(timestamp);
            setTransactionHistory((state) => [
              ...state,
              { ...trans, address: el.address, isSuccess, timestamp },
            ]);
          });
        });
      });
  };

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
    <div className="content transaction-list">
      {transactionHistory.map((el) => (
        <div key={el.hash} className="transaction-item">
          <div className="transaction-item__row">
            <img src={git} alt="coin" className="transaction-item__img" />
            <span className="transaction-item__black-text">BNB.AM</span>
            <img
              src={clockIcon}
              alt="when"
              className="transaction-item__right transaction-item__clock"
            />
            <span className="transaction-item__grey-text transaction-item__time">
              {formatDate(el.timestamp)}
            </span>
            {!el.isSuccess && (
              <Link
                to={`/status/${el.hash}`}
                className="transaction-item__view-status"
              >
                View status
              </Link>
            )}
            <div
              className={`transaction-item__status ${
                el.isSuccess
                  ? 'transaction-item__status--checked'
                  : 'transaction-item__status--loading'
              }`}
            >
              <img src={el.isSuccess ? checkIcon : spinnerIcon} alt="status" />
              {el.isSuccess ? 'Success' : 'Pending'}
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
                {el.value.toNumber()} BNB.AM
              </span>
            </div>
          </div>
          <div className="transaction-item__row">
            <div className="transaction-item__mobile-row">
              <span className="transaction-item__grey-text">Destination:</span>
              <span className="transaction-item__black-text">
                Account c082 -
                {` ${el.address.substring(0, 9)}...${el.address.substring(
                  el.address.length - 9,
                  el.address.length,
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
      ))}
    </div>
  );
};

export default TransactionList;
