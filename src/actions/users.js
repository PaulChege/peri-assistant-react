import periAssistantApi from "../api/periAssistantApi";
import {
  USER_CREATE,
  USER_CREATE_FAILED,
  USER_CREATE_SUCCESS,
  USER_CREATE_CLEAR,
  USER_LOGIN,
  USER_LOGIN_GOOGLE,
  USER_LOGIN_FAILED,
  USER_EDIT,
  USER_EDIT_FAILED,
  USER_EDIT_SUCCESS,
  USER_EDIT_CLEAR,
  USER_SHOW,
  USER_DELETE
} from "./types";
import { setToken, getToken, logout } from "../auth/auth";

export const createUser = formValues => async dispatch => {
  try {
    const response = await periAssistantApi.post("/signup", {
      user: formValues
    });
    setToken(response.data.token);
    dispatch({
      type: USER_CREATE,
      payload: { ...response.data.user, token: response.data.token }
    });
    dispatch({ type: USER_CREATE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_CREATE_FAILED,
      payload: error.response.data.message
    });
  }
};

export const clearUserCreateSuccess = () => ({ type: USER_CREATE_CLEAR });

export const loginUser = formValues => async dispatch => {
  try {
    const response = await periAssistantApi.post("/auth/login", formValues);
    setToken(response.data.token);
    dispatch({
      type: USER_LOGIN,
      payload: { ...response.data.user, token: response.data.token }
    });
  } catch (error) {
    // TODO - Handle Network Errors
    dispatch({
      type: USER_LOGIN_FAILED,
      payload: error.response.data.message
    });
  }
};

export const googleLoginUser = formValues => async dispatch => {
  try {
    const response = await periAssistantApi.post("/auth/login_google", formValues);
    setToken(response.data.token);
    dispatch({
      type: USER_LOGIN_GOOGLE,
      payload: { ...response.data.user, token: response.data.token }
    });
  } catch (error) {
    // TODO - Handle Network Errors
    dispatch({
      type: USER_LOGIN_FAILED,
      payload: error.response.data.message
    });
  }
};

export const updateUser = formValues => async dispatch => {
  try {
    const response = await periAssistantApi.put(`/user`, {
      user: formValues
    });
    dispatch({
      type: USER_EDIT,
      payload: response.data.user
    });
    window.location.reload();
  } catch (error) {
    dispatch({
      type: USER_EDIT_FAILED,
      payload: error.response.data.message
    });
  }
};

export const getUser = () => async dispatch => {
  try {
    const response = await periAssistantApi.get(`/user`);
    dispatch({
      type: USER_SHOW,
      payload: response.data
    });
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};

export const deleteUser = () => async dispatch => {
  try {
    await periAssistantApi.delete(`/user`);
    dispatch({
      type: USER_DELETE
    });
    window.location.reload();
  } catch (error) {
    if (error.response.status === 401) {
      logout(dispatch);
    }
  }
};

export const clearUserEditSuccess = () => ({ type: USER_EDIT_CLEAR });
