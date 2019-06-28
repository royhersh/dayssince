import * as actions from '../actions/types';

const initialState = {
  showPlusButton: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_EDIT_MODE:
    case actions.CREATE_NEW_ITEM:
      return { ...state, showPlusButton: false };

    case actions.UNSET_EDIT_MODE:
    case actions.DELETE_ANIMATE:
      return { ...state, showPlusButton: true };

    default:
      return state;
  }
};
