import {
  USER_CREATE,
  USER_EDIT,
  USER_LOGIN,
  USER_LOGIN_GOOGLE,
  USER_LOGOUT,
  USER_SHOW,
  USER_DELETE,
  USER_CREATE_SUCCESS,
  USER_CREATE_CLEAR,
  USER_EDIT_SUCCESS,
  USER_EDIT_CLEAR
} from "../actions/types";

const INITIAL_STATE = { userCreated: false, userUpdated: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return { ...state, currentUser: action.payload, isSignedIn: true };
    case USER_LOGIN_GOOGLE:
      return { ...state, currentUser: action.payload, isSignedIn: true };
    case USER_CREATE:
      return { ...state, currentUser: action.payload, isSignedIn: true };
    case USER_CREATE_SUCCESS:
      return { ...state, userCreated: true };
    case USER_CREATE_CLEAR:
      return { ...state, userCreated: false };
    case USER_EDIT:
      return { ...state, currentUser: action.payload };
    case USER_EDIT_SUCCESS:
      return { ...state, userUpdated: true };
    case USER_EDIT_CLEAR:
      return { ...state, userUpdated: false };
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
