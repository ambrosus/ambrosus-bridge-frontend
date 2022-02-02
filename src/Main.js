import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import Home from './pages/Home';

const Main = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Redirect to="/" />
  </Switch>
);

export default Main;
