import * as actions from './types';

export function fetchData() {
  return {
    type: actions.FETCH_DATA,
  };
}

export function addItem({ date, title }) {
  return {
    type: actions.ADD_ITEM,
    payload: { date, title },
  };
}
