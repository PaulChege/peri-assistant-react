import periAssistantApi from "../api/periAssistantApi";
import { STUDENT_LESSONS_LIST } from "./types";
import { logout, getToken } from "../auth/auth";

export const getLessonList = student_id => async dispatch => {
  try {
    periAssistantApi.defaults.headers.common["Authorization"] = getToken();
    const response = await periAssistantApi.get(
      `/students/${student_id}/lessons`
    );
    dispatch({ type: STUDENT_LESSONS_LIST, payload: response.data });
  } catch (err) {
    if (err.response.status === 401) {
      logout(dispatch);
    }
  }
};
