import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';

import Login from './routes/Login';
import Layout from './Layout';
import PrivateRoute from './components/PrivateRoute';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { I18nProvider } from './I18n';
toast.configure();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <I18nProvider>
          <Switch>
            <Route path="/login" exact component={Login} />
            <PrivateRoute path="/" component={Layout} />
          </Switch>
        </I18nProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
