import React from 'react';
import { Switch, Route } from 'react-router';
import AllVessels from './AllVessels';
import NewVessel from './NewVessel';
import ViewVessel from './ViewVessel';

function Reports() {
  return (
    <Switch>
      <Route path="/vessels" exact component={AllVessels} />
      <Route path="/vessels/new" exact component={NewVessel} />
      <Route path="/vessels/:id" exact component={ViewVessel} />
      <Route path="/vessels/:id/edit" exact component={NewVessel} />
    </Switch>
  );
}

export default Reports;
