import {
  USER_CREATE,
  USER_CREATE_FAILED,
  USER_LOGIN,
  USER_LOGIN_FAILED
} from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return { ...state, currentUser: action.payload };
    case USER_LOGIN_FAILED:
      return { ...state, errors: action.payload };
    case USER_CREATE:
      return { ...state, currentUser: action.payload };
    case USER_CREATE_FAILED:
      return { ...state, errors: action.payload };
    default:
      return state;
  }
};
