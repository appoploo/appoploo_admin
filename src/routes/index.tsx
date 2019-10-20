import React from 'react';
import { Switch, Redirect, Link } from 'react-router-dom';
import { Route, useHistory } from 'react-router';
import NotFound from './NotFound';
import Vessels from './Vessels';

export function Render() {
  const history = useHistory();
  return <h1>{history.location.pathname}</h1>;
}

function RedirectToVesseles() {
  return <Redirect to="/vessels" />;
}
const Routes = () => {
  return (
    <Switch>
      <Route component={NotFound} exact path="/not-found" />
      <Route exact path="/" component={RedirectToVesseles} />
      <Route path="/vessels" component={Vessels} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
