import * as actions from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case actions.FETCH_DATA: {
      return action.payload;
    }

    case actions.ADD_ITEM:
      return [
        ...state,
        {
          _id: Date.now(),
          ...action.payload,
        },
      ];

    case actions.CREATE_NEW_ITEM:
      return [
        {
          _id: Date.now(),
          date: Date.now(),
          editMode: true,
        },
        ...state,
      ];

    case actions.UPDATE_ITEM: {
      const { _id, ...rest } = action.payload;

      return state.map((item) => {
        if (item._id !== _id) return item;

        return {
          ...item,
          ...rest,
          editMode: false,
        };
      });
    }

    case actions.SET_EDIT_MODE: {
      const { _id } = action.payload;

      return state.map((item) => {
        if (item._id === _id) {
          return {
            ...item,
            editMode: true,
          };
        }
        return item;
      });
    }

    case actions.UNSET_EDIT_MODE: {
      const { _id } = action.payload;

      return state.map((item) => {
        if (item._id === _id) {
          return {
            ...item,
            editMode: false,
          };
        }
        return item;
      });
    }

    case actions.DELETE_ANIMATE: {
      const { _id } = action.payload;

      return state.map((item) => {
        if (item._id === _id) {
          return {
            ...item,
            deleteAnimation: true,
          };
        }
        return item;
      });
    }

    case actions.DELETE_ITEM: {
      const { _id } = action.payload;

      return state.filter(item => item._id !== _id);
    }

    default:
      return state;
  }
};
