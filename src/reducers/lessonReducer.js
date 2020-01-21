import {
  STUDENT_LESSONS_LIST,
  STUDENT_LESSONS_CREATE,
  STUDENT_LESSONS_UPDATE,
  STUDENT_LESSONS_SHOW
} from "../actions/types";
import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case STUDENT_LESSONS_LIST:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case STUDENT_LESSONS_SHOW:
      return { ...state, [action.payload.id]: action.payload };
    case STUDENT_LESSONS_CREATE:
      return { ...state, [action.payload.id]: action.payload };
    case STUDENT_LESSONS_UPDATE:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
