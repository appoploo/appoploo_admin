import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route, useHistory } from 'react-router';
import NotFound from './NotFound';
import Vessels from './Vessels';
import Notifications from './Notifications';
import Boundaries from './Boundaries';
import Map from './Map';

export function Render() {
  const history = useHistory();
  return <h1>{history.location.pathname}</h1>;
}

function RedirectToMap() {
  return <Redirect to="/map" />;
}
const Routes = () => {
  return (
    <Switch>
      <Route component={NotFound} exact path="/not-found" />
      <Route exact path="/" component={RedirectToMap} />
      <Route path="/vessels" component={Vessels} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/boundaries" component={Boundaries} />
      <Route path="/map" component={Map} />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
