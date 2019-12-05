import periAssistantApi from "../../api/periAssistantApi";
import { STUDENT_LIST } from "../types";

export const getStudentList = () => async dispatch => {
  periAssistantApi.defaults.headers.common[
    "Authorization"
  ] = localStorage.getItem("token");
  const response = await periAssistantApi.get("/students");
  dispatch({ type: STUDENT_LIST, payload: response.data });
};
