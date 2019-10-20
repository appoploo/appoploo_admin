import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';

import Login from './routes/Login';
import Layout from './Layout';
import PrivateRoute from './components/PrivateRoute';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
toast.configure();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={Login} />
          <PrivateRoute path="/" component={Layout} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
