import axios from "axios";

let apiBase = axios.create({ baseURL: "/api" });

// Configure interceptors
export const configAPI = (store, logoutUser, tokenRefresher) => {
  apiBase.interceptors.request.use(
    async (config) => {
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
      console.log("Current Token:", token);

      const tokenExpiry =
        sessionStorage.getItem("tokenExpiry") ||
        localStorage.getItem("tokenExpiry");
      console.log("Current Token expiry:", tokenExpiry);

      const refreshToken =
        sessionStorage.getItem("refreshToken") ||
        localStorage.getItem("refreshToken");
      console.log("Current Refresh token:", refreshToken);

      const fiveMinutesFromNow = Math.floor(
        (Date.now() + 5 * 60 * 1000) / 1000
      );
      console.log("Five minutes from now:", fiveMinutesFromNow);
      console.log("Current time:", Math.floor(Date.now() / 1000));
      if (token) {
        if (tokenExpiry <= fiveMinutesFromNow) {
          if (tokenExpiry <= Date.now() / 1000) {
            console.log("Token expired. Logging out...");
            store.dispatch(logoutUser());
            return (window.location.href = "/login");
          }
          console.log("Token about to expire. Refreshing token...");
          const {
            token: newToken,
            refreshToken: newRefreshToken,
            tokenExpiry: newTokenExpiry,
          } = await store.dispatch(tokenRefresher(refreshToken));
          console.log("New token:", newToken);
          console.log("New refresh token:", newRefreshToken);
          console.log("New token expiry:", newTokenExpiry);
          config.headers.Authorization = `Bearer ${newToken}`;
          //     try {
          //       const {
          //         token: newToken,
          //         refreshToken: newRefreshToken,
          //         tokenExpiry: newTokenExpiry,
          //       } = await apiBase.post("/auth/refresh-token", { refreshToken });
          //       console.log("New token:", newToken);
          //       console.log("New refresh token:", newRefreshToken);
          //       console.log("New token expiry:", newTokenExpiry);
          //       config.headers.Authorization = `Bearer ${newToken}`;
          //       sessionStorage.setItem("token", newToken);
          //       localStorage.setItem("token", newToken);
          //       sessionStorage.setItem("refreshToken", newRefreshToken);
          //       localStorage.setItem("refreshToken", newRefreshToken);
          //       sessionStorage.setItem("tokenExpiry", newTokenExpiry);
          //       localStorage.setItem("tokenExpiry", newTokenExpiry);
          //     } catch (error) {
          //       console.error("Error refreshing token:", error);
          //       alert(`Session expired. Please log in again. ${error}`);
          //       return (window.location.href = "/login");
          //     }
          // window.location.href = "/login";
        } else config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
};

export default apiBase;
