import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiBase from "../../utils/apiBase";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiBase.post("/users/login", formData);
      console.log("login response:", response.data);
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
      const response = await apiBase.post("/users/register", formData);
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
  async (formData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const { data } = await apiBase.put("/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const { data } = await apiBase.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Data:", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const tokenRefresher = createAsyncThunk(
  "auth/tokenRefresher",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await apiBase.post("/users/refresh-token", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return rejectWithValue(
        error.response.data || "An error occurred while refreshing token"
      );
    }
  }
);

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("tokenExpiry");
  sessionStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const initialState = {
  user:
    JSON.parse(sessionStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("user")) ||
    null,
  token:
    sessionStorage.getItem("token") || localStorage.getItem("token") || null,
  tokenExpiry:
    sessionStorage.getItem("tokenExpiry") ||
    localStorage.getItem("tokenExpiry") ||
    null,
  refreshToken:
    sessionStorage.getItem("refreshToken") ||
    localStorage.getItem("refreshToken") ||
    null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated:
    !!sessionStorage.getItem("token") || !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
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
        console.log("Payload:", action.payload);
        state.token = action.payload.token;
        state.tokenExpiry = action.payload.tokenExpiry;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        sessionStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("user", JSON.stringify(action.payload));
        console.log(
          "user stored in localStorage:",
          JSON.parse(localStorage.getItem("user"))
        );
        sessionStorage.setItem("token", action.payload.token);
        localStorage.setItem("token", action.payload.token);
        sessionStorage.setItem("tokenExpiry", action.payload.tokenExpiry);
        localStorage.setItem("tokenExpiry", action.payload.tokenExpiry);
        sessionStorage.setItem("refreshToken", action.payload.refreshToken);
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
        // state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        sessionStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log("Error updating profile:", action.payload);
      })
      .addCase(fetchProfile.pending, (state) => {
        // state.loading = true;
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
      .addCase(tokenRefresher.pending, (state) => {
        state.error = null;
      })
      .addCase(tokenRefresher.fulfilled, (state, action) => {
        const { token, refreshToken, tokenExpiry } = action.payload;
        state.token = token;
        state.refreshToken = refreshToken;
        state.tokenExpiry = tokenExpiry;
        sessionStorage.setItem("token", token);
        localStorage.setItem("token", token);
        sessionStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        sessionStorage.setItem("tokenExpiry", tokenExpiry);
        localStorage.setItem("tokenExpiry", tokenExpiry);
      })
      .addCase(tokenRefresher.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
