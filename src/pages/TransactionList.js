import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import providers from '../utils/providers';
import { createBridgeContract } from '../contracts';
import TransactionListItem from '../components/TransactionListItem';
import useBridges from '../hooks/useBridges';

const TransactionList = () => {
  const { account } = useWeb3React();
  const bridges = useBridges();

  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    Object.keys(bridges).forEach((chainId) => {
      Object.values(bridges[chainId]).forEach((address) => {
        getHistory(address, chainId);
      });
    });
  }, []);

  const getHistory = (address, networkId) => {
    const contract = createBridgeContract(address, providers[networkId]);

    contract
      .queryFilter(contract.filters.Withdraw(account))
      .then((response) => {
        response.forEach(async (el) => {
          const { timestamp } = await el.getBlock();

          el.getTransaction().then((trans) => {
            setTransactionHistory((state) => [
              ...state,
              { ...trans, timestamp, args: el.args },
            ]);
          });
        });
      });
  };

  const sortedTxs = transactionHistory.sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  return (
    <div className="content transaction-list">
      {sortedTxs.map((el) => (
        <TransactionListItem tx={el} key={el.hash} />
      ))}
    </div>
  );
};

export default TransactionList;
