import { STUDENT_INSTRUMENT_LIST, USER_LOGOUT } from "./types";
import { getToken, removeToken } from "../auth/token";
import periAssistantApi from "../api/periAssistantApi";
import history from "../history";

export const getStudentInstrumentList = () => async dispatch => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.get("/instruments");
    dispatch({ type: STUDENT_INSTRUMENT_LIST, payload: response.data });
  } catch (err) {
    if (err.response.status === 401) {
      _logout(dispatch);
    }
  }
};

const _logout = dispatch => {
  removeToken();
  dispatch({ type: USER_LOGOUT, payload: { isSignedIn: false } });
  history.push("/login");
};
