import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../utils/api";

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

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/users/profile", formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/profile");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;
      const response = await refreshAuthToken(refreshToken);
      const { token, refreshToken: newRefreshToken } = response;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", newRefreshToken);

      return { token, refreshToken: newRefreshToken };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token:
    sessionStorage.getItem("token") || localStorage.getItem("token") || null,
  refreshToken:
    sessionStorage.getItem("refreshToken") ||
    localStorage.getItem("refreshToken") ||
    null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false,
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
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
