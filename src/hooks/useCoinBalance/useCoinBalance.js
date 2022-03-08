import { useEffect, useState } from 'react';

//  eslint-ignore-next-line
const worker = new Worker(new URL('./worker.js', import.meta.url));

worker.addEventListener('message', ({ data: { type, address, balance } }) => {
  if (type === 'balance') {
    sessionStorage.setItem(address, balance);
  }
});

const useCoinBalance = (tokenAddress) => {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    setBalance(sessionStorage.getItem(tokenAddress));

    const handleMessage = ({ data }) => {
      if (data.address === tokenAddress) {
        sessionStorage.setItem(data.address, data.balance);
        setBalance(data.balance);
      }
    };

    worker.addEventListener('message', handleMessage);
    return () => {
      worker.removeEventListener('message', handleMessage);
    };
  }, [tokenAddress]);

  return balance;
};

export default useCoinBalance;

export const useSubscribeOnBalanceUpdate = (callback) => {
  useEffect(() => {
    worker.addEventListener('message', callback);
    return () => {
      worker.removeEventListener('message', callback);
    };
  }, []);
};
