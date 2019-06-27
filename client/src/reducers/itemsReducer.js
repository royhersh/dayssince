import * as actions from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case actions.FETCH_DATA: {
      const localState = JSON.parse(localStorage.getItem('items'));
      return localState || state;
    }

    case actions.ADD_ITEM:
      return [
        ...state,
        {
          id: Date.now(),
          ...action.payload,
        },
      ];

    case actions.CREATE_NEW_ITEM:
      return [
        {
          id: Date.now(),
          date: Date.now(),
          editMode: true,
        },
        ...state,
      ];

    case actions.UPDATE_ITEM: {
      const { id, title } = action.payload;

      return state.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          title,
          editMode: false,
        };
      });
    }

    case actions.SET_EDIT_MODE: {
      const { id } = action.payload;

      return state.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            editMode: true,
          };
        }
        return item;
      });
    }

    case actions.UNSET_EDIT_MODE: {
      const { id } = action.payload;

      return state.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            editMode: false,
          };
        }
        return item;
      });
    }

    case actions.DELETE_ANIMATE: {
      const { id } = action.payload;

      return state.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            deleteAnimation: true,
          };
        }
        return item;
      });
    }

    case actions.DELETE_ITEM: {
      const { id } = action.payload;

      return state.filter(item => item.id !== id);
    }

    default:
      return state;
  }
};
