import {
  USER_CREATE,
  USER_EDIT,
  USER_LOGIN,
  USER_LOGIN_GOOGLE,
  USER_LOGOUT,
  USER_SHOW,
  USER_DELETE
} from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return { ...state, currentUser: action.payload, isSignedIn: true };
    case USER_LOGIN_GOOGLE:
      return { ...state, currentUser: action.payload, isSignedIn: true };
    case USER_CREATE:
      return { ...state, currentUser: action.payload, isSignedIn: true };
    case USER_EDIT:
      return { ...state, currentUser: action.payload };
    case USER_SHOW:
      return { ...state, currentUser: action.payload };
    case USER_DELETE:
      return { isSignedIn: false };
    case USER_LOGOUT:
      return { isSignedIn: false };
    default:
      return state;
  }
};
