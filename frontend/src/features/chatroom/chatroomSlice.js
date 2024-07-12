import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  chatrooms: [],
  searchResults: [],
  loading: false,
  error: null,
};

export const fetchChatRooms = createAsyncThunk(
  "chatrooms/fetchChatRooms",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("User token is missing");

    try {
      const response = await axios.get("/api/chatrooms/my-chatrooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.chatrooms;
    } catch (error) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchChatRooms = createAsyncThunk(
  "chatrooms/searchChatRooms",
  async (query, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("User token is missing");

    try {
      const response = await axios.get(`/api/chatrooms/search?query=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.chatrooms;
    } catch (error) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllChatRooms = createAsyncThunk(
  "chatrooms/getAllChatRooms",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("User token is missing");

    try {
      const response = await axios.get("/api/chatrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.chatrooms;
    } catch (error) {
      if (!error.response) throw error;
      return rejectWithValue(error.response.data);
    }
  }
);

const chatroomsSlice = createSlice({
  name: "chatrooms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.chatrooms = action.payload;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch chatrooms";
      })
      .addCase(searchChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.chatrooms = action.payload;
      })
      .addCase(searchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search chat rooms";
      });
  },
});

export default chatroomsSlice.reducer;
