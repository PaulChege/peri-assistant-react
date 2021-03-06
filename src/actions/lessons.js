import periAssistantApi from "../api/periAssistantApi";
import {
  STUDENT_LESSONS_LIST,
  STUDENT_LESSONS_CREATE,
  STUDENT_LESSONS_CREATE_FAILED,
  STUDENT_LESSONS_UPDATE,
  STUDENT_LESSONS_UPDATE_FAILED,
  STUDENT_LESSONS_SHOW,
  STUDENT_LESSONS_DELETE,
  FLASH_SUCCESS,
  STUDENT_LESSONS_REMINDERS_FAILED,
} from "./types";
import { logout, getToken } from "../auth/auth";
import history from "../history";

export const getLessonList = (student_id) => async (dispatch) => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.get(
      `/students/${student_id}/lessons`
    );
    dispatch({ type: STUDENT_LESSONS_LIST, payload: response.data });
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};

export const createLesson = (studentId, formValues) => async (dispatch) => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.post(
      `/students/${studentId}/lessons`,
      { lesson: formValues }
    );
    dispatch({ type: STUDENT_LESSONS_CREATE, payload: response.data });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Lesson creation successful!",
    });
    history.push(`/student/${studentId}/lessons`);
  } catch (error) {
    dispatch({
      type: STUDENT_LESSONS_CREATE_FAILED,
      payload: error.response.data.message,
    });
  }
};

export const getLesson = (studentId, lessonId) => async (dispatch) => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
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
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.put(
      `/students/${studentId}/lessons/${lessonId}`,
      {
        lesson: formValues,
      }
    );
    dispatch({ type: STUDENT_LESSONS_UPDATE, payload: response.data });
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Lesson update successful!",
    });
    history.push(`/student/${studentId}/lessons`);
  } catch (error) {
    dispatch({
      type: STUDENT_LESSONS_UPDATE_FAILED,
      payload: error.response.data.message,
    });
  }
};

export const deleteLesson = (studentId, lessonId) => async (dispatch) => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
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
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    await periAssistantApi.post(
      `/students/${studentId}/send_payment_reminders`
    );
    dispatch({
      type: FLASH_SUCCESS,
      payload: "Payment reminders sent!",
    });
    history.push(`/student/${studentId}/lessons`);
  } catch (error) {
    dispatch({
      type: STUDENT_LESSONS_REMINDERS_FAILED,
      payload: error.response.data.message,
    });
  }
};
