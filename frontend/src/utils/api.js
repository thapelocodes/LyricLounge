import axios from "axios";
import { refreshToken } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "/api",
});

export const configureApi = (store) => {
  api.interceptors.request.use((config) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error;
      const originalRequest = error.config;

      if (response && response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await store.dispatch(refreshToken()).unwrap();
          const state = store.getState();
          const newToken = state.auth.token;

          axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export const fetchUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await api.put("/users/profile", data);
  return response.data;
};

export default api;
