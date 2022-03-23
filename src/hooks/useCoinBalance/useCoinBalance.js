import { useContext, useEffect, useState } from 'react';
import { getCachedCoinBalance } from './utils';
import ERC20BalanceWorkerContext from '../../contexts/CoinBalanceWorkerContext';

export const useCoinBalance = (tokenAddress) => {
  const worker = useContext(ERC20BalanceWorkerContext);

  const [balance, setBalance] = useState({
    string: '0',
    formattedString: '0.0',
    float: 0.0,
  });

  useEffect(() => {
    const cachedBalance = getCachedCoinBalance(tokenAddress);
    setBalance(cachedBalance);

    const handleMessage = ({ data: { address, balance: newBalance } }) => {
      if (address === tokenAddress) {
        setBalance(newBalance);
      }
    };

    worker.addEventListener('message', handleMessage);
    return () => {
      worker.removeEventListener('message', handleMessage);
    };
  }, [tokenAddress]);

  return balance;
};

export const useSubscribeOnBalanceUpdate = (callback) => {
  const worker = useContext(ERC20BalanceWorkerContext);

  useEffect(() => {
    worker.addEventListener('message', callback);
    return () => {
      worker.removeEventListener('message', callback);
    };
  }, []);
};
