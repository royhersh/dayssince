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

export function setEditMode(id) {
  return {
    type: actions.SET_EDIT_MODE,
    payload: { id },
  };
}

export function unsetEditMode(id) {
  return {
    type: actions.UNSET_EDIT_MODE,
    payload: { id },
  };
}

export function deleteItem(id) {
  return {
    type: actions.DELETE_ITEM,
    payload: { id },
  };
}
