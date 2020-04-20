import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route, useHistory } from 'react-router';
import NotFound from './NotFound';
import Vessels from './Vessels';
import Notifications from './Notifications';
import Boundaries from './Boundaries';

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
      <Route path="/notifications" component={Notifications} />
      <Route path="/boundaries" component={Boundaries} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
