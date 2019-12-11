import { STUDENT_INSTRUMENT_LIST } from "../actions/types";

const INITIAL_STATE = {
  instrumentList: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STUDENT_INSTRUMENT_LIST:
      return { ...state, instrumentList: action.payload };
    default:
      return state;
  }
};
