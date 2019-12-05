import periAssistantApi from "../../api/periAssistantApi";
import history from "../../history";
import {
  USER_CREATE,
  USER_CREATE_FAILED,
  USER_LOGIN,
  USER_LOGIN_FAILED,
  USER_LOGOUT
} from "../types";

export const userCreate = formValues => async dispatch => {
  try {
    const response = await periAssistantApi.post("/signup", formValues);
    localStorage.setItem("token", response.data.token);
    dispatch({
      type: USER_CREATE,
      payload: { ...response.data.user, token: response.data.token }
    });
    history.push("/");
  } catch (error) {
    dispatch({
      type: USER_CREATE_FAILED,
      payload: error.response.data.message
    });
  }
};

export const userLogin = formValues => async dispatch => {
  try {
    const response = await periAssistantApi.post("/auth/login", formValues);
    localStorage.setItem("token", response.data.token);
    dispatch({
      type: USER_LOGIN,
      payload: { ...response.data.user, token: response.data.token }
    });
    history.push("/");
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAILED,
      payload: error.response.data.message
    });
  }
};

export const userLogout = () => {
  localStorage.removeItem("token");
  history.push("/login");
  return {
    type: USER_LOGOUT,
    payload: { isSignedIn: false }
  };
};
