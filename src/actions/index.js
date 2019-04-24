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

export function createNewItem() {
  return {
    type: actions.CREATE_NEW_ITEM,
  };
}

export function updateItem(payload) {
  return {
    type: actions.UPDATE_ITEM,
    payload,
  };
}
