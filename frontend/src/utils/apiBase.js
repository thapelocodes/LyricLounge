import axios from "axios";

const apiBase = axios.create({ baseURL: "/api" });

// Configure interceptors
apiBase.interceptors.request.use((config) => {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiBase.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await apiBase.post("/users/refresh-token");
        const { token, refreshToken } = response.data;

        // Update tokens
        sessionStorage.setItem("token", token);
        localStorage.setItem("token", token);
        sessionStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiBase(originalRequest);
      } catch (refreshError) {
        // Handle unauthenticated state
        // You can handle logout or redirect here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiBase;
