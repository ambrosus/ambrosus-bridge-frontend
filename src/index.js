import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Main from './Main';
import ERC20BalanceWorkerContext from './contexts/ERC20BalanceWorkerContext';

const erc20BalanceWorker = new Worker('./workers/erc20BalanceWorker.js');

erc20BalanceWorker.addEventListener(
  'message',
  ({ data: { balance, type, address } }) => {
    if (type === 'balance') {
      sessionStorage.setItem(address, JSON.stringify(balance));
    }
  },
);

ReactDOM.render(
  <BrowserRouter>
    <ERC20BalanceWorkerContext.Provider value={erc20BalanceWorker}>
      <Main />
    </ERC20BalanceWorkerContext.Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);
