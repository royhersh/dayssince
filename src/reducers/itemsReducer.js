import * as actions from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case actions.ADD_ITEM:
      console.log(action);
      return [...state, {
        id: Date.now(),
        ...action.payload,
      }];

    default:
      return state;
  }
};
