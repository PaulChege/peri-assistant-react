import { USER_LOGOUT } from "../actions/types";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  return localStorage.setItem("token", token);
};

export const removeToken = () => {
  return localStorage.removeItem("token");
};

export const logout = () => {
  removeToken();
  return { type: USER_LOGOUT, payload: { isSignedIn: false } };
};
