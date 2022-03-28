import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import providers, { ambChainId, ethChainId } from '../utils/providers';
import createBridgeContract from '../contracts';
import TransactionListItem from '../components/TransactionListItem';

const TransactionList = () => {
  const { account } = useWeb3React();
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    getHistory(ethChainId);
    getHistory(ambChainId);
  }, []);

  const getHistory = (networkId) => {
    const provider = providers[networkId];
    const contract = createBridgeContract[networkId](provider);

    contract
      .queryFilter(contract.filters.Withdraw(account))
      .then((response) => {
        response.forEach(async (el) => {
          const { timestamp } = await el.getBlock();

          el.getTransaction().then((trans) => {
            setTransactionHistory((state) => [
              ...state,
              { ...trans, address: el.address, timestamp },
            ]);
          });
        });
      });
  };

  return (
    <div className="content transaction-list">
      {transactionHistory.map((el) => (
        <TransactionListItem tx={el} key={el.hash} />
      ))}
    </div>
  );
};

export default TransactionList;
