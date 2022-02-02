import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import PropTypes from 'prop-types';
import Status from './pages/Status';
import Exchange from './components/Home/Exchange';
import Layout from './components/Layout';
import ConnectWallet from './components/Home/ConnectWallet';
import Confirmation from './pages/Confirmation';

const getLibrary = (provider = null) => new providers.Web3Provider(provider);

const Main = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Layout title="Bridge">
      <Routing />
    </Layout>
  </Web3ReactProvider>
);

export default Main;

const Routing = () => {
  const { account } = useWeb3React();
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
        condition={!account}
      />
      <Route exact path="/status/:txHash" component={Status} />
      <ConditionalRoute
        exact
        path="/history"
        render={<p>history</p>}
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
