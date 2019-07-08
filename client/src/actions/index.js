/* Actions */
import * as actions from './types';
import { isLoggedIn } from '../utils/common';
import api from '../utils/api';

export const populateItems = items => ({
  type: actions.FETCH_DATA,
  payload: items,
});

export const updateDbId = payload => ({
  type: actions.UPDATE_DB_ID,
  payload,
});

export const createNewItem = () => async (dispatch) => {
  const now = Date.now();
  dispatch({
    type: actions.CREATE_NEW_ITEM,
    payload: {
      renderId: now,
      date: now,
      editMode: true,
    },
  });
  if (isLoggedIn()) {
    // call api to create item
    const newItem = await api.POST.createItem({ date: now, title: '' });

    // when come back, update id from db
    dispatch(updateDbId({ renderId: now, dbId: newItem._id }));
  }
};

export const updateItem = payload => ({
  type: actions.UPDATE_ITEM,
  payload,
});

export const setEditMode = id => ({
  type: actions.SET_EDIT_MODE,
  payload: { renderId: id },
});

export const unsetEditMode = id => ({
  type: actions.UNSET_EDIT_MODE,
  payload: { renderId: id },
});

export const deleteItem = id => (dispatch) => {
  dispatch({
    type: actions.DELETE_ANIMATE,
    payload: { renderId: id },
  });
  setTimeout(
    () => dispatch({
      type: actions.DELETE_ITEM,
      payload: { renderId: id },
    }),
    500,
  );
};
