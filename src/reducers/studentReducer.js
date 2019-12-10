import {
  STUDENT_LIST,
  STUDENT_CREATE,
  STUDENT_CREATE_FAILED
} from "../actions/types";
import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case STUDENT_LIST:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case STUDENT_CREATE:
      return { ...state, [action.payload.id]: action.payload };
    case STUDENT_CREATE_FAILED:
      return { ...state, createErrors: action.payload };
    default:
      return state;
  }
};
