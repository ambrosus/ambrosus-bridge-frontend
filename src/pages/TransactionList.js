import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import providers, { ambChainId } from '../utils/providers';
import { createBridgeContract } from '../contracts';
import TransactionListItem from '../components/TransactionListItem';
import useBridges from '../hooks/useBridges';
import getEventFromContract from '../utils/ethers/getEventFromContract';
const TransactionList = () => {
  const { account } = useWeb3React();
  const bridges = useBridges();

  const [transactionHistory, setTransactionHistory] = useState([]);
  const { REACT_APP_BSC_FROM_BLOCK } = process.env;

  useEffect(() => {
    if (bridges) {
      Object.keys(bridges).forEach((chainId) => {
        Object.keys(bridges[chainId]).forEach((type) => {
          getHistory(
            bridges[chainId][type],
            type === 'native' ? ambChainId : +chainId,
          );
        });
      });
    }
  }, [bridges]);

  const getHistory = (address, networkId) => {
    const contract = createBridgeContract(address, providers[networkId]);
    const filter = contract.filters.Withdraw(account);

    getEventFromContract(
      networkId,
      contract,
      filter,
      +REACT_APP_BSC_FROM_BLOCK,
    ).then((response) => {
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
