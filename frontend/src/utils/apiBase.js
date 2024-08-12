import axios from "axios";

const apiBase = axios.create({ baseURL: "/api" });

// Configure interceptors
apiBase.interceptors.request.use((config) => {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiBase;
