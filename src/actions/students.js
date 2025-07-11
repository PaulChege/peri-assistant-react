import periAssistantApi from "../api/periAssistantApi";
import {
  STUDENT_LIST,
  STUDENT_CREATE,
  STUDENT_CREATE_FAILED,
  STUDENT_CREATE_SUCCESS,
  STUDENT_CREATE_CLEAR,
  STUDENT_UPDATE,
  STUDENT_UPDATE_FAILED,
  STUDENT_UPDATE_SUCCESS,
  STUDENT_UPDATE_CLEAR,
  STUDENT_SHOW,
  STUDENT_DELETE,
  FLASH_SUCCESS,
} from "./types";
import { getToken, logout } from "../auth/auth";

export const getStudentList = (search = "") => async (dispatch) => {
  try {
    const response = await periAssistantApi.get(`/students?query=${search}`);
    dispatch({ type: STUDENT_LIST, payload: response.data });
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};

export const createStudent = (formValues) => async (dispatch) => {
  try {
    const response = await periAssistantApi.post("/students", {
      student: formValues,
    });
    dispatch({
      type: STUDENT_CREATE,
      payload: response.data,
    });
    dispatch({
      type: STUDENT_CREATE_SUCCESS,
    });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Student creation successful!",
    });
  } catch (error) {
    dispatch({
      type: STUDENT_CREATE_FAILED,
      payload: error.response.data.message,
    });
  }
};

export const clearStudentCreateSuccess = () => ({ type: STUDENT_CREATE_CLEAR });

export const getStudent = (student_id) => async (dispatch) => {
  try {
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
    const response = await periAssistantApi.put(`/students/${student_id}`, {
      student: formValues,
    });
    dispatch({ type: STUDENT_UPDATE, payload: response.data });
    dispatch({ type: STUDENT_UPDATE_SUCCESS });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Student update successful!",
    });
  } catch (error) {
    dispatch({
      type: STUDENT_UPDATE_FAILED,
      payload: error.response.data.message,
    });
  }
};

export const clearStudentUpdateSuccess = () => ({ type: STUDENT_UPDATE_CLEAR });

export const deleteStudent = (student_id) => async (dispatch) => {
  try {
    await periAssistantApi.delete(`/students/${student_id}`);
    dispatch({ type: STUDENT_DELETE, payload: student_id });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Student deletion successful!",
    });
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};
