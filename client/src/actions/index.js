/* Actions */
import * as actions from './types';

export const fetchData = () => {
  const localState = JSON.parse(localStorage.getItem('items'));
  return {
    type: actions.FETCH_DATA,
    payload: localState || [],
  };
};
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

export const setEditMode = id => ({
  type: actions.SET_EDIT_MODE,
  payload: { id },
});

export const unsetEditMode = id => ({
  type: actions.UNSET_EDIT_MODE,
  payload: { id },
});

export const deleteItem = id => (dispatch) => {
  dispatch({
    type: actions.DELETE_ANIMATE,
    payload: { id },
  });
  setTimeout(
    () => dispatch({
      type: actions.DELETE_ITEM,
      payload: { id },
    }),
    500,
  );
};
