import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import git from '../assets/svg/github-icon.svg';
import clockIcon from '../assets/svg/clock.svg';
import checkIcon from '../assets/svg/check.svg';
import IconLink from '../components/IconLink';
import providers from '../utils/providers';
import { abi } from '../utils/abi';

const TransactionList = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    getHistory(4);
    getHistory(30741);
  }, []);

  const getHistory = (networkId) => {
    const wallet = new ethers.Wallet(
      '8837f5e0da6e78481efe5145cbabe30f951477faa44ebf9abefbf864d5873397',
    );
    const signer = wallet.connect(providers[networkId]);
    const contract = new ethers.Contract(
      networkId === 4
        ? '0x7727F5e11D7b628f3D7215a113423151C43C7772'
        : '0xc5bBbF47f604adFDB7980BFa6115CfdBF992413c',
      abi,
      signer,
    );
    contract
      .queryFilter(
        contract.filters.Withdraw('0x34eD3aaf2F01279b1C68B80CAF1209B8D6b6D253'),
      )
      .then((response) => {
        response.forEach((el) => {
          el.getTransaction().then((trans) => {
            setTransactionHistory((state) => [
              ...state,
              { ...trans, address: el.address },
            ]);
          });
        });
      });
  };

  return (
    <div className="content transaction-list">
      {transactionHistory.map((el) => (
        <div className="transaction-item">
          <div className="transaction-item__row">
            <img src={git} alt="coin" className="transaction-item__img" />
            <span className="transaction-item__black-text">BNB.AM</span>
            <img
              src={clockIcon}
              alt="when"
              className="transaction-item__right transaction-item__clock"
            />
            <span className="transaction-item__grey-text">
              5 seconds ago (01.02.2022, 18:02:13)
            </span>
            <div className="transaction-item__status">
              <img src={checkIcon} alt="check" />
              Success
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
              <span className="transaction-item__black-text">≈$3</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
