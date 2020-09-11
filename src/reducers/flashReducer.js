import { FLASH_SUCCESS, CLEAR_FLASH } from "../actions/types";
export default (state = {}, action) => {
  switch (action.type) {
    case FLASH_SUCCESS:
      return {
        message: action.payload,
      };
    case CLEAR_FLASH:
      return {};
    default:
      return state;
  }
};
