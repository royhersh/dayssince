/* Actions */
import axios from 'axios';
import * as actions from './types';

export const populateItems = items => ({
  type: actions.FETCH_DATA,
  payload: items,
});

export const addItem = ({ date, title }) => ({
  type: actions.ADD_ITEM,
  payload: { date, title },
});

export const createNewItem = () => ({
  type: actions.CREATE_NEW_ITEM,
});

export const updateItem = payload => ({
  type: actions.UPDATE_ITEM,
  payload,
});

export const setEditMode = _id => ({
  type: actions.SET_EDIT_MODE,
  payload: { _id },
});

export const unsetEditMode = _id => ({
  type: actions.UNSET_EDIT_MODE,
  payload: { _id },
});

export const deleteItem = _id => (dispatch) => {
  dispatch({
    type: actions.DELETE_ANIMATE,
    payload: { _id },
  });
  setTimeout(
    () => dispatch({
      type: actions.DELETE_ITEM,
      payload: { _id },
    }),
    500,
  );
};
