import { STUDENT_LIST } from "../actions/types";
import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case STUDENT_LIST:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    default:
      return state;
  }
};
