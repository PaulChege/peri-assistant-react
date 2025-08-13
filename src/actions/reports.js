import periAssistantApi from "../api/periAssistantApi";
import {
  REPORTS_LIST,
  REPORTS_CREATE,
  REPORTS_CREATE_FAILED,
  REPORTS_CREATE_SUCCESS,
  REPORTS_CREATE_CLEAR,
  REPORTS_UPDATE,
  REPORTS_UPDATE_FAILED,
  REPORTS_UPDATE_SUCCESS,
  REPORTS_UPDATE_CLEAR,
  REPORTS_SHOW,
  REPORTS_DELETE,
  FLASH_SUCCESS,
} from "./types";
import { logout } from "../auth/auth";

export const getReportsList = (page = 1) => async (dispatch) => {
  try {
    const response = await periAssistantApi.get(`/reports?page=${page}`);
    dispatch({ type: REPORTS_LIST, payload: response.data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logout(dispatch);
    }
  }
};

export const getStudentsForReports = () => async (dispatch) => {
  try {
    const response = await periAssistantApi.get('/users/students');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching students for reports:', error);
    return [];
  }
};

export const createReport = (formValues) => async (dispatch) => {
  try {
    const response = await periAssistantApi.post("/reports", { report: formValues });
    dispatch({ type: REPORTS_CREATE, payload: response.data });
    dispatch({ type: REPORTS_CREATE_SUCCESS });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Report creation successful!",
    });
  } catch (error) {
    dispatch({
      type: REPORTS_CREATE_FAILED,
      payload: error.response.data.message,
    });
  }
};

export const clearReportCreateSuccess = () => ({ type: REPORTS_CREATE_CLEAR });

export const getReport = (reportId) => async (dispatch) => {
  try {
    const response = await periAssistantApi.get(`/reports/${reportId}`);
    dispatch({ type: REPORTS_SHOW, payload: response.data });
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};

export const updateReport = (reportId, formValues) => async (dispatch) => {
  try {
    const response = await periAssistantApi.put(`/reports/${reportId}`, {
      report: formValues,
    });
    dispatch({ type: REPORTS_UPDATE, payload: response.data });
    dispatch({ type: REPORTS_UPDATE_SUCCESS });
  } catch (error) {
    dispatch({
      type: REPORTS_UPDATE_FAILED,
      payload: error.response.data.message,
    });
  }
};

export const clearReportUpdateSuccess = () => ({ type: REPORTS_UPDATE_CLEAR });

export const deleteReport = (reportId) => async (dispatch) => {
  try {
    await periAssistantApi.delete(`/reports/${reportId}`);
    dispatch({ type: REPORTS_DELETE, payload: reportId });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Report deletion successful!",
    });
    window.location.reload();
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};
