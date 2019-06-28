import { combineReducers } from 'redux';
import itemsReducer from './itemsReducer';
import uiReducer from './uiReducer';

const rootReducer = combineReducers({
  items: itemsReducer,
  ui: uiReducer,
});

export default rootReducer;
