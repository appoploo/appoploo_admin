import palette from './palette';
import overrides from './overrides';
import { createMuiTheme } from '@material-ui/core';
import typography from './typography';

const theme = createMuiTheme({
  palette,
  overrides,
  typography: typography,
  zIndex: {
    appBar: 1000,
    drawer: 1100
  }
});

export default theme;
