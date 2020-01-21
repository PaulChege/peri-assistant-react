import periAssistantApi from "../api/periAssistantApi";
import {
  STUDENT_LESSONS_LIST,
  STUDENT_LESSONS_CREATE,
  STUDENT_LESSONS_CREATE_FAILED,
  STUDENT_LESSONS_UPDATE,
  STUDENT_LESSONS_UPDATE_FAILED,
  STUDENT_LESSONS_SHOW
} from "./types";
import { logout, getToken } from "../auth/auth";
import history from "../history";

export const getLessonList = student_id => async dispatch => {
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

export const createLesson = (studentId, formValues) => async dispatch => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.post(
      `/students/${studentId}/lessons`,
      { lesson: formValues }
    );
    dispatch({ type: STUDENT_LESSONS_CREATE, payload: response.data });
    history.push(`/student/${studentId}/lessons`);
  } catch (error) {
    dispatch({
      type: STUDENT_LESSONS_CREATE_FAILED,
      payload: error.response.data.message
    });
  }
};

export const getLesson = (studentId, lessonId) => async dispatch => {
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

export const updateLesson = (
  studentId,
  lessonId,
  formValues
) => async dispatch => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.put(
      `/students/${studentId}/lessons/${lessonId}`,
      {
        lesson: formValues
      }
    );
    dispatch({ type: STUDENT_LESSONS_UPDATE, payload: response.data });
    history.push(`/student/${studentId}/lessons`);
  } catch (error) {
    dispatch({
      type: STUDENT_LESSONS_UPDATE_FAILED,
      payload: error.response.data.message
    });
  }
};
