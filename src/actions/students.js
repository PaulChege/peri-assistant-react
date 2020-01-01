import periAssistantApi from "../api/periAssistantApi";
import {
  STUDENT_LIST,
  STUDENT_CREATE,
  STUDENT_CREATE_FAILED,
  STUDENT_SHOW
} from "./types";
import history from "../history";
import { getToken, logout } from "../auth/auth";

export const getStudentList = () => async dispatch => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.get("/students");
    dispatch({ type: STUDENT_LIST, payload: response.data });
  } catch (err) {
    logout(dispatch);
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

export const getStudent = student_id => async dispatch => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.get(`/students/${student_id}`);
    dispatch({ type: STUDENT_SHOW, payload: response.data });
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};
