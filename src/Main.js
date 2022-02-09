import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import Home from './pages/Home';

const getLibrary = (provider = null) => new providers.Web3Provider(provider);

const Main = () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <Switch>
      <Route path="/" exact component={Home} />
      <Redirect to="/" />
    </Switch>
  </Web3ReactProvider>
);
export default Main;
