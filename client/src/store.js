import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { FETCH_DATA } from './actions/types';

const saveStateToLocalStorage = store => next => (action) => {
  next(action);
  if (action.type === FETCH_DATA /* ||  user.isLoggedIn */) return;
  const { items } = store.getState();
  localStorage.setItem('items', JSON.stringify(items));
};
/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk, saveStateToLocalStorage),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
);
/* eslint-enable */

store.subscribe(() => {
  console.log(store.getState());
});
export default store;
