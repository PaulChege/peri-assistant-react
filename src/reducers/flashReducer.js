import { STUDENT_CREATE_SUCCESS, CLEAR_FLASH } from "../actions/types";
export default (state = {}, action) => {
  switch (action.type) {
    case STUDENT_CREATE_SUCCESS:
      return {
        message: "Student creation successful",
      };
    case CLEAR_FLASH:
      return {};
    default:
      return state;
  }
};
