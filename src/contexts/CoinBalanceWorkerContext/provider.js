import React, { useEffect, useState } from 'react';

// non-obvious import
// web worker imported with webpack's worker-loader in "inline mode"
// instead of creating custom webpack-config for one specific case
// for details: https://v4.webpack.js.org/loaders/worker-loader/

// eslint-disable-next-line import/no-unresolved
import CoinBalanceWorker from 'worker-loader!../../workers/coinBalanceWorker';
import CoinBalanceWorkerContext from './context';

const CoinBalanceWorkerProvider = (props) => {
  const [worker, setWorker] = useState();
  useEffect(() => {
    const newWorker = new CoinBalanceWorker();

    setWorker(newWorker);
  }, []);

  return <CoinBalanceWorkerContext.Provider value={worker} {...props} />;
};

export default CoinBalanceWorkerProvider;
