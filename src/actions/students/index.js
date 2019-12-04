import periAssistantApi from "../../api/periAssistantApi";
import { STUDENT_LIST } from "../types";

export const getStudentList = () => async (dispatch, getState) => {
  periAssistantApi.defaults.headers.common[
    "Authorization"
  ] = getState().user.currentUser.token;
  const response = await periAssistantApi.get("/students");
  dispatch({ type: STUDENT_LIST, payload: response.data });
};
