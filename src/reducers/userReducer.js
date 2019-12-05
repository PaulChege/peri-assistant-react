import {
  USER_CREATE,
  USER_CREATE_FAILED,
  USER_LOGIN,
  USER_LOGIN_FAILED,
  USER_LOGOUT
} from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return { ...state, currentUser: action.payload, isSignedIn: true };
    case USER_LOGIN_FAILED:
      return { ...state, loginErrors: action.payload };
    case USER_CREATE:
      return { ...state, currentUser: action.payload, isSignedIn: true };
    case USER_CREATE_FAILED:
      return { ...state, createErrors: action.payload };
    case USER_LOGOUT:
      return { isSignedIn: false };
    default:
      return state;
  }
};
