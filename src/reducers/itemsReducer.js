import * as actions from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case actions.ADD_ITEM:
      console.log(action);
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
            editMode: true
          };
        }
        return item;
      });
    }

    default:
      return state;
  }
};
