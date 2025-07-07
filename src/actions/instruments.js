import { STUDENT_INSTRUMENT_LIST } from "./types";
import { getToken, logout } from "../auth/auth";
import periAssistantApi from "../api/periAssistantApi";

export const getInstrumentList = () => async dispatch => {
  try {
    const response = await periAssistantApi.get("/instruments");
    dispatch({ type: STUDENT_INSTRUMENT_LIST, payload: response.data });
  } catch (err) {
    if (err.response.status === 401) {
      logout(dispatch);
    }
  }
};
