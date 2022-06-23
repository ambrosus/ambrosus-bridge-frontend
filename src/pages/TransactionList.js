import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import providers, { ambChainId, ethChainId } from '../utils/providers';
import createBridgeContractById, {
  ambContractAddress,
  ethContractAddress,
} from '../contracts';
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
    const contract = createBridgeContractById[networkId](provider);

    contract
      .queryFilter(contract.filters.Withdraw(account))
      .then((response) => {
        response.forEach(async (el) => {
          const { timestamp } = await el.getBlock();

          el.getTransaction().then((trans) => {
            if (
              trans.to === ambContractAddress ||
              trans.to === ethContractAddress
            ) {
              setTransactionHistory((state) => [
                ...state,
                { ...trans, timestamp, args: el.args },
              ]);
            }
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
