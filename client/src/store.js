import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { FETCH_DATA } from './actions/types';

const saveStateToLocalStorage = store => next => (action) => {
  const isUserLoggedIn = !!localStorage.getItem('token');

  next(action);
  if (action.type === FETCH_DATA || isUserLoggedIn) return;
  const { items } = store.getState();
  localStorage.setItem('items', JSON.stringify(items));
};

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => createStore(rootReducer, composeEnhancers(applyMiddleware(ReduxThunk, saveStateToLocalStorage)));
