import axios from "axios";
import { getToken } from "../auth/auth";

const api = axios.create({
  baseURL: "http://localhost:3001"
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
