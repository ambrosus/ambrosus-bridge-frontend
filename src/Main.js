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

const getLibrary = (provider = null) => new providers.Web3Provider(provider);

const Main = () => {
  const [error, setError] = useState('');

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ErrorContext.Provider value={{ error, setError }}>
        <Layout title="Bridge" error={error}>
          <Routing setError={setError} />
        </Layout>
      </ErrorContext.Provider>
    </Web3ReactProvider>
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
