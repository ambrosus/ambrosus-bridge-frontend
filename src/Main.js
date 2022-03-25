import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import PropTypes from 'prop-types';
import Status from './pages/Status';
import Exchange from './pages/Exchange';
import Layout from './components/Layout';
import ConnectWallet from './pages/ConnectWallet';
import Confirmation from './pages/Confirmation';
import ErrorContext from './contexts/ErrorContext';
import TransactionList from './pages/TransactionList';
import CoinBalanceWorkerContext from './contexts/CoinBalanceWorkerContext';

// non-obvious block of code
// web worker imported with webpack's worker-loader in "inline mode"
// instead of creating custom webpack-config for one specific case
// for details: https://v4.webpack.js.org/loaders/worker-loader/

/* eslint-disable */
import CoinBalanceWorker from 'worker-loader!./workers/coinBalanceWorker';
const worker = new CoinBalanceWorker();
/* eslint-enable */

worker.addEventListener('message', ({ data: { balance, type, address } }) => {
  if (type === 'balance') {
    sessionStorage.setItem(address, JSON.stringify(balance));
  }
});

const getLibrary = (provider = null) => {
  console.log(provider);
  return new providers.Web3Provider(provider);
};

const Main = () => {
  const [error, setError] = useState('');

  return (
    <CoinBalanceWorkerContext.Provider value={worker}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ErrorContext.Provider value={{ error, setError }}>
          <Layout title="Bridge" error={error}>
            <Routing setError={setError} />
          </Layout>
        </ErrorContext.Provider>
      </Web3ReactProvider>
    </CoinBalanceWorkerContext.Provider>
  );
};

export default Main;

const Routing = () => {
  const web3 = useWeb3React();

  const { account } = web3;
  return (
    <Switch>
      <Route exact path="/" component={ConnectWallet} />
      <ConditionalRoute
        exact
        path="/exchange"
        component={Exchange}
        condition={!!account}
      />
      <ConditionalRoute
        exact
        path="/confirm"
        component={Confirmation}
        condition={!!account}
      />
      <ConditionalRoute
        exact
        path="/status/:txHash"
        component={Status}
        condition={!!account}
      />
      <ConditionalRoute
        exact
        path="/history"
        component={TransactionList}
        condition={!!account}
      />
      <Redirect to="/" />
    </Switch>
  );
};

const ConditionalRoute = ({ children, condition = false, ...props }) =>
  condition ? <Route {...props}>{children}</Route> : <Redirect to="/" />;

ConditionalRoute.propTypes = {
  children: PropTypes.node,
  condition: PropTypes.bool,
};
