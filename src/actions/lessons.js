import periAssistantApi from "../api/periAssistantApi";
import {
  STUDENT_LESSONS_LIST,
  STUDENT_LESSONS_CREATE,
  STUDENT_LESSONS_CREATE_FAILED,
  STUDENT_LESSONS_CREATE_SUCCESS,
  STUDENT_LESSONS_CREATE_CLEAR,
  STUDENT_LESSONS_UPDATE,
  STUDENT_LESSONS_UPDATE_FAILED,
  STUDENT_LESSONS_UPDATE_SUCCESS,
  STUDENT_LESSONS_UPDATE_CLEAR,
  STUDENT_LESSONS_SHOW,
  STUDENT_LESSONS_DELETE,
  FLASH_SUCCESS,
  STUDENT_LESSONS_REMINDERS_FAILED,
} from "./types";
import { logout, getToken } from "../auth/auth";

export const getLessonList = (student_id, past_page = 1, upcoming_page = 1) => async (dispatch) => {
  try {
    const response = await periAssistantApi.get(
      `/students/${student_id}/lessons?past_page=${past_page}&upcoming_page=${upcoming_page}`
    );
    dispatch({ type: STUDENT_LESSONS_LIST, payload: response.data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logout(dispatch);
    }
  }
};

export const createLesson = (studentId, formValues) => async (dispatch) => {
  try {
    const response = await periAssistantApi.post(
      `/students/${studentId}/lessons`,
      { lesson: formValues }
    );
    dispatch({ type: STUDENT_LESSONS_CREATE, payload: response.data });
    dispatch({ type: STUDENT_LESSONS_CREATE_SUCCESS });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Lesson creation successful!",
    });
  } catch (error) {
    dispatch({
      type: STUDENT_LESSONS_CREATE_FAILED,
      payload: error.response.data.message,
    });
  }
};

export const clearLessonCreateSuccess = () => ({ type: STUDENT_LESSONS_CREATE_CLEAR });

export const getLesson = (studentId, lessonId) => async (dispatch) => {
  try {
    const response = await periAssistantApi.get(
      `/students/${studentId}/lessons/${lessonId}`
    );
    dispatch({ type: STUDENT_LESSONS_SHOW, payload: response.data });
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};

export const updateLesson = (studentId, lessonId, formValues) => async (
  dispatch
) => {
  try {
    const response = await periAssistantApi.put(
      `/students/${studentId}/lessons/${lessonId}`,
      {
        lesson: formValues,
      }
    );
    dispatch({ type: STUDENT_LESSONS_UPDATE, payload: response.data });
    dispatch({ type: STUDENT_LESSONS_UPDATE_SUCCESS });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Lesson update successful!",
    });
  } catch (error) {
    dispatch({
      type: STUDENT_LESSONS_UPDATE_FAILED,
      payload: error.response.data.message,
    });
  }
};

export const clearLessonUpdateSuccess = () => ({ type: STUDENT_LESSONS_UPDATE_CLEAR });

export const deleteLesson = (studentId, lessonId) => async (dispatch) => {
  try {
    await periAssistantApi.delete(`/students/${studentId}/lessons/${lessonId}`);
    dispatch({ type: STUDENT_LESSONS_DELETE, payload: lessonId });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Lesson deletion successful!",
    });
    window.location.reload();
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};

export const sendPaymentReminders = (studentId) => async (dispatch) => {
  try {
    await periAssistantApi.post(
      `/students/${studentId}/send_payment_reminders`
    );
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Payment reminders sent!",
    });
  } catch (error) {
    dispatch({
      type: STUDENT_LESSONS_REMINDERS_FAILED,
      payload: error.response.data.message,
    });
  }
};
