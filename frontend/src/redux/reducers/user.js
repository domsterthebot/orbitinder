import {
  ADD_USER_PROFILE,
  ADD_USER_PREFERENCES,
  GET_USER_DATA,
  CLEAR_LOG_OUT
} from '../actions/user';

const initialState = {
  userData: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER_PROFILE:
      return {
        ...state,
        userData: action.userData
      };
    case ADD_USER_PREFERENCES:
      return {
        ...state,
        userData: action.preferenceData
      };
    case GET_USER_DATA:
      return {
        userData: action.userData
      };
    case CLEAR_LOG_OUT:
      return {};
    default:
      return state;
  }
};
