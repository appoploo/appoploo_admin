import React from 'react';
import { Switch, Route } from 'react-router';
import AllVessels from './AllVessels';
import NewVessel from './NewVessel';
import ViewVessel from './ViewVessel';
import NotFound from '../NotFound';

function Reports() {
  return (
    <Switch>
      <Route path="/vessels" exact component={AllVessels} />
      <Route path="/vessels/new" exact component={NewVessel} />
      <Route path="/vessels/:id" exact component={NotFound} />
      <Route path="/vessels/:id/edit" exact component={NotFound} />
    </Switch>
  );
}

export default Reports;
