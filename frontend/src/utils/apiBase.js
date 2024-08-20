import axios from "axios";

let apiBase = axios.create({ baseURL: process.env.REACT_APP_API_URL });
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// Configure interceptors
export const configAPI = (store, logoutUser, tokenRefresher) => {
  apiBase.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
      config.headers.authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiBase.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const { token } = await store.dispatch(tokenRefresher()).unwrap();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest._retry = true;
            isRefreshing = false;
            onRefreshed(token);
            return apiBase(originalRequest);
          } catch (error) {
            isRefreshing = false;
            store.dispatch(logoutUser());
            window.location.href = "/login";
            return Promise.reject(error);
          }
        }

        const retryOriginalRequest = new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiBase(originalRequest));
          });
        });

        return retryOriginalRequest;
      }

      return Promise.reject(error);
    }
  );
};

export default apiBase;
