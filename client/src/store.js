import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { FETCH_DATA } from './actions/types';

const saveStateToLocalStorage = store => next => (action) => {
  next(action);
  if (action.type === FETCH_DATA /* ||  user.isLoggedIn */) return;
  const { items } = store.getState();
  localStorage.setItem('items', JSON.stringify(items));
};
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(ReduxThunk, saveStateToLocalStorage)),
);
/* eslint-enable */

store.subscribe(() => {
  console.log(store.getState());
});
export default store;
