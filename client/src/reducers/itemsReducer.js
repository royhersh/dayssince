import * as actions from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case actions.FETCH_DATA: {
      return action.payload;
    }

    case actions.CREATE_NEW_ITEM:
      return [action.payload, ...state];

    case actions.UPDATE_ITEM: {
      const { renderId, ...rest } = action.payload;

      return state.map((item) => {
        if (item.renderId !== renderId) return item;

        return {
          ...item,
          ...rest,
          editMode: false,
        };
      });
    }

    case actions.UPDATE_DB_ID: {
      const { renderId, dbId } = action.payload;

      return state.map((item) => {
        if (item.renderId !== renderId) return item;

        return {
          ...item,
          dbId,
        };
      });
    }

    case actions.SET_EDIT_MODE: {
      const { renderId } = action.payload;

      return state.map((item) => {
        if (item.renderId === renderId) {
          return {
            ...item,
            editMode: true,
          };
        }
        return item;
      });
    }

    case actions.UNSET_EDIT_MODE: {
      const { renderId } = action.payload;

      return state.map((item) => {
        if (item.renderId === renderId) {
          return {
            ...item,
            editMode: false,
          };
        }
        return item;
      });
    }

    case actions.DELETE_ANIMATE: {
      const { renderId } = action.payload;

      return state.map((item) => {
        if (item.renderId === renderId) {
          return {
            ...item,
            deleteAnimation: true,
          };
        }
        return item;
      });
    }

    case actions.DELETE_ITEM: {
      const { renderId } = action.payload;

      return state.filter(item => item.renderId !== renderId);
    }

    default:
      return state;
  }
};
