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
      `/lessons?student_id=${student_id}&past_page=${past_page}&upcoming_page=${upcoming_page}`
    );
    dispatch({ type: STUDENT_LESSONS_LIST, payload: response.data });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logout(dispatch);
    }
  }
};

export const getAllLessons = (institution_filter = "", past_page = 1, upcoming_page = 1) => async (dispatch) => {
  try {
    let url = `/lessons?past_page=${past_page}&upcoming_page=${upcoming_page}`;
    if (institution_filter) {
      url += `&institution_filter=${encodeURIComponent(institution_filter)}`;
    }
    const response = await periAssistantApi.get(url);
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
      `/lessons`,
      { lesson: { ...formValues, student_id: studentId } }
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
      `/lessons/${lessonId}`
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
      `/lessons/${lessonId}`,
      {
        lesson: formValues,
      }
    );
    dispatch({ type: STUDENT_LESSONS_UPDATE, payload: response.data });
    dispatch({ type: STUDENT_LESSONS_UPDATE_SUCCESS });
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
    await periAssistantApi.delete(`/lessons/${lessonId}`);
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
