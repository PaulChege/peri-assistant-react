import { USER_CREATE, USER_LOGIN, USER_LOGOUT } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return { ...state, currentUser: action.payload, isSignedIn: true };
    case USER_CREATE:
      return { ...state, currentUser: action.payload, isSignedIn: true };
    case USER_LOGOUT:
      return { isSignedIn: false };
    default:
      return state;
  }
};
