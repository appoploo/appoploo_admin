import account, { IAccount } from './account';
import { combineReducers, AnyAction } from 'redux';
import { LOGOUT } from '../names';
import i18n, { II18n } from './i18n';
import errors, { IErrors } from './errors';

export interface IReduxStore {
  account: IAccount;
  i18n: II18n;
  errors: IErrors;
}

const appReducer = combineReducers({
  account,
  i18n,
  errors
});

const rootReducer = (state: IReduxStore | undefined, action: AnyAction) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
