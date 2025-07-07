import {
  STUDENT_LIST,
  STUDENT_CREATE,
  STUDENT_CREATE_SUCCESS,
  STUDENT_CREATE_CLEAR,
  STUDENT_UPDATE,
  STUDENT_UPDATE_SUCCESS,
  STUDENT_UPDATE_CLEAR,
  STUDENT_SHOW,
  STUDENT_DELETE,
} from "../actions/types";
import _ from "lodash";

const INITIAL_STATE = { studentCreated: false, studentUpdated: false };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STUDENT_LIST:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case STUDENT_CREATE:
      return { ...state, [action.payload.id]: action.payload };
    case STUDENT_CREATE_SUCCESS:
      return { ...state, studentCreated: true };
    case STUDENT_CREATE_CLEAR:
      return { ...state, studentCreated: false };
    case STUDENT_UPDATE:
      return { ...state, [action.payload.id]: action.payload };
    case STUDENT_UPDATE_SUCCESS:
      return { ...state, studentUpdated: true };
    case STUDENT_UPDATE_CLEAR:
      return { ...state, studentUpdated: false };
    case STUDENT_SHOW:
      return { ...state, [action.payload.id]: action.payload };
    case STUDENT_DELETE:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
