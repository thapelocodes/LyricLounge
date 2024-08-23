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
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiBase.get("/users/refresh-token");
      console.log("Refresh token response:", response.data);
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
};

const persistedState = JSON.parse(localStorage.getItem("persist:root"));
const user = JSON.parse(persistedState.user);
const token = JSON.parse(persistedState.token);

const initialState = {
  user,
  token,
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false, //!!localStorage.getItem("token"),
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
        // localStorage.setItem("user", JSON.stringify(action.payload));
        console.log("Payload:", action.payload);
        state.token = action.payload.token;
        // localStorage.setItem("token", action.payload.token);
        state.isAuthenticated = true;
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
        const { token } = action.payload;
        state.token = token;
        // localStorage.setItem("token", token);
      })
      .addCase(tokenRefresher.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
