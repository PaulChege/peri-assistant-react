import periAssistantApi from "../api/periAssistantApi";
import {
  STUDENT_LIST,
  USER_LOGOUT,
  STUDENT_CREATE,
  STUDENT_CREATE_FAILED
} from "./types";
import history from "../history";
import { getToken, removeToken } from "../auth/token";

export const getStudentList = () => async dispatch => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.get("/students");
    dispatch({ type: STUDENT_LIST, payload: response.data });
  } catch (err) {
    if (err.response.status === 401) {
      _logout(dispatch);
    }
  }
};

export const createStudent = formValues => async dispatch => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.post("/students", {
      student: formValues
    });
    dispatch({
      type: STUDENT_CREATE,
      payload: response.data
    });
    history.push("/");
  } catch (err) {
    dispatch({
      type: STUDENT_CREATE_FAILED,
      payload: err.response.data.message
    });
  }
};

const _logout = dispatch => {
  removeToken();
  dispatch({ type: USER_LOGOUT, payload: { isSignedIn: false } });
  history.push("/login");
};
