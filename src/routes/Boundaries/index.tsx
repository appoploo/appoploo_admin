import React from 'react';
import { Switch, Route } from 'react-router';
import Boundaries from './boundaries';
import AllBoundaries from './AllBoundaries';

function Reports() {
  return (
    <Switch>
      <Route path="/boundaries" exact component={AllBoundaries} />
      <Route path="/boundaries/:id" exact component={Boundaries} />
    </Switch>
  );
}

export default Reports;
