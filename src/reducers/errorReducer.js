import {
  STUDENT_CREATE_FAILED,
  USER_LOGIN_FAILED,
  USER_CREATE_FAILED
} from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case STUDENT_CREATE_FAILED:
      return { ...state, studentCreateError: action.payload };
    case USER_LOGIN_FAILED:
      return { ...state, userLoginError: action.payload };
    case USER_CREATE_FAILED:
      return { ...state, userCreateError: action.payload };
    default:
      return state;
  }
};
