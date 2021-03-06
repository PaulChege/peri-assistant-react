import {
  STUDENT_CREATE_FAILED,
  STUDENT_UPDATE_FAILED,
  STUDENT_LESSONS_CREATE_FAILED,
  STUDENT_LESSONS_UPDATE_FAILED,
  USER_LOGIN_FAILED,
  USER_CREATE_FAILED,
  USER_EDIT_FAILED,
  STUDENT_LESSONS_REMINDERS_FAILED,
} from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case STUDENT_CREATE_FAILED:
      return { ...state, studentCreateError: action.payload };
    case STUDENT_UPDATE_FAILED:
      return { ...state, studentUpdateError: action.payload };
    case USER_LOGIN_FAILED:
      return { ...state, userLoginError: action.payload };
    case USER_CREATE_FAILED:
      return { ...state, userCreateError: action.payload };
    case USER_EDIT_FAILED:
      return { ...state, userEditError: action.payload };
    case STUDENT_LESSONS_CREATE_FAILED:
      return { ...state, lessonCreateError: action.payload };
    case STUDENT_LESSONS_UPDATE_FAILED:
      return { ...state, lessonUpdateError: action.payload };
    case STUDENT_LESSONS_REMINDERS_FAILED:
      return { ...state, paymentReminderError: action.payload };
    default:
      return state;
  }
};
