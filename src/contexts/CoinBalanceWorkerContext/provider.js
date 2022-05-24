import React, { useEffect, useState } from 'react';
import Dexie from 'dexie';

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

    // fallback for Dexie observable
    // due to issues with useLiveQuery in Safari < 15.4
    // proposed in here
    // https://github.com/dexie/Dexie.js/issues/1573

    if (typeof BroadcastChannel === 'undefined') {
      newWorker.addEventListener('message', (event) => {
        if (event.data.type === 'storagemutated') {
          Dexie.on('storagemutated').fire(event.data.updatedParts);
        }
      });
    }
  }, []);

  return <CoinBalanceWorkerContext.Provider value={worker} {...props} />;
};

export default CoinBalanceWorkerProvider;
