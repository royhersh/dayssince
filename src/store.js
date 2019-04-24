import { createStore/* , applyMiddleware */ } from 'redux';
import rootReducer from './reducers/rootReducer';
/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

store.subscribe(() => {
  console.log(store.getState());
});
export default store;
