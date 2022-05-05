import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import PropTypes from 'prop-types';
import Status from './pages/Status';
import Exchange from './pages/Exchange';
import Layout from './components/Layout';
import ConnectWallet from './pages/ConnectWallet';
import Confirmation from './pages/Confirmation';
// import Mint from './pages/Mint';
import ErrorContext from './contexts/ErrorContext';
import TransactionList from './pages/TransactionList';
import CoinBalanceWorkerProvider from './contexts/CoinBalanceWorkerContext/provider';
import {
  ConfiguredInjectedConnector,
  ConfiguredWalletConnectConnector,
} from './utils/web3ReactConnectors';
// import useAutoLogin from './hooks/useAutoLogin';

const getLibrary = (provider = null) => new providers.Web3Provider(provider);

const Main = () => {
  const [error, setError] = useState('');

  return (
    <CoinBalanceWorkerProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ErrorContext.Provider value={{ error, setError }}>
          <Layout title="Bridge" error={error}>
            <Routing setError={setError} />
          </Layout>
        </ErrorContext.Provider>
      </Web3ReactProvider>
    </CoinBalanceWorkerProvider>
  );
};

export default Main;

const Routing = () => {
  const web3 = useWeb3React();
  const { account, activate } = web3;

  const [isLoaded, setLoading] = useState(false);
  useEffect(() => {
    const previousLogin = sessionStorage.getItem('wallet');
    if (previousLogin === 'metamask') {
      activate(ConfiguredInjectedConnector).then(() => setLoading(true));
    } else if (previousLogin === 'wallet-connect') {
      activate(ConfiguredWalletConnectConnector).then(() => setLoading(true));
    } else {
      setLoading(true);
    }
  }, []);

  return isLoaded ? (
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
      <Route exact path="/status/:txHash" component={Status} />
      <ConditionalRoute
        exact
        path="/history"
        component={TransactionList}
        condition={!!account}
      />
      {/* <Route exact path="/mint" component={Mint} /> */}
      <Redirect to="/" />
    </Switch>
  ) : null;
};

const ConditionalRoute = ({ children, condition = false, ...props }) =>
  condition ? <Route {...props}>{children}</Route> : <Redirect to="/" />;

ConditionalRoute.propTypes = {
  children: PropTypes.node,
  condition: PropTypes.bool,
};
