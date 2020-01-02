import {
  STUDENT_LIST,
  STUDENT_CREATE,
  STUDENT_UPDATE,
  STUDENT_SHOW
} from "../actions/types";
import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case STUDENT_LIST:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case STUDENT_CREATE:
      return { ...state, [action.payload.id]: action.payload };
    case STUDENT_SHOW:
      return { ...state, [action.payload.id]: action.payload };
    case STUDENT_UPDATE:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
