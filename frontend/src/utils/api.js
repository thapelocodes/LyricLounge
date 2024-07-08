import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

export const configAPI = (store) => {
  api.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
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
