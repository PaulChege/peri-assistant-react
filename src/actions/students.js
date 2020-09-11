import periAssistantApi from "../api/periAssistantApi";
import {
  STUDENT_LIST,
  STUDENT_CREATE,
  STUDENT_CREATE_FAILED,
  STUDENT_UPDATE,
  STUDENT_UPDATE_FAILED,
  STUDENT_SHOW,
  STUDENT_DELETE,
  FLASH_SUCCESS,
} from "./types";
import history from "../history";
import { getToken, logout } from "../auth/auth";

export const getStudentList = () => async (dispatch) => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.get("/students");
    dispatch({ type: STUDENT_LIST, payload: response.data });
  } catch {
    logout(dispatch);
  }
};

export const createStudent = (formValues) => async (dispatch) => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.post("/students", {
      student: formValues,
    });
    dispatch({
      type: STUDENT_CREATE,
      payload: response.data,
    });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Student creation successful!",
    });

    history.push("/");
  } catch (error) {
    dispatch({
      type: STUDENT_CREATE_FAILED,
      payload: error.response.data.message,
    });
  }
};

export const getStudent = (student_id) => async (dispatch) => {
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

export const updateStudent = (student_id, formValues) => async (dispatch) => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.put(`/students/${student_id}`, {
      student: formValues,
    });
    dispatch({ type: STUDENT_UPDATE, payload: response.data });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Student update successful!",
    });
    history.push(`/student/${student_id}/lessons`);
  } catch (error) {
    dispatch({
      type: STUDENT_UPDATE_FAILED,
      payload: error.response.data.message,
    });
  }
};

export const deleteStudent = (student_id) => async (dispatch) => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    await periAssistantApi.delete(`/students/${student_id}`);
    dispatch({ type: STUDENT_DELETE, payload: student_id });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Student deletion successful!",
    });
    history.push("/");
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};
