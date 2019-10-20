import { createStore, compose } from 'redux';
import reducers, { IReduxStore } from './reducers';
import { loadState, saveState } from './localStorage';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window?.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose;

const persistedData = loadState() as IReduxStore;

const store = createStore(reducers, persistedData, composeEnhancers());

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
