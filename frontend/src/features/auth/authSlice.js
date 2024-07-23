import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const refreshAuthToken = async () => {
  try {
    const response = await axios.get("/api/users/refresh", {
      refreshToken:
        sessionStorage.getItem("refreshToken") ||
        localStorage.getItem("refreshToken"),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Token refresh failed");
  }
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/users/login", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An error occurred"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/users/register", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An error occurred"
      );
    }
  }
);

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await refreshAuthToken();
      const { token: newToken, refreshToken: newRefreshToken } = response;

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user:
    sessionStorage.getItem("profile") ||
    localStorage.getItem("profile") ||
    null,
  token:
    sessionStorage.getItem("token") || localStorage.getItem("token") || null,
  refreshToken:
    sessionStorage.getItem("refreshToken") ||
    localStorage.getItem("refreshToken") ||
    null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated:
    (!!sessionStorage.getItem("token") &&
      !!sessionStorage.getItem("refreshToken")) ||
    (!!localStorage.getItem("token") && !!localStorage.getItem("refreshToken")),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        sessionStorage.setItem("token", action.payload.token);
        sessionStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        sessionStorage.setItem("token", action.payload.token);
        sessionStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
