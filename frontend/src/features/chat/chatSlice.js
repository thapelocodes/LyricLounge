import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatrooms = createAsyncThunk(
  "chat/fetchChatrooms",
  async () => {
    const response = await axios.get("/api/chats");
    return response.data;
  }
);

export const fetchUserChatrooms = createAsyncThunk(
  "chat/fetchUserChatrooms",
  async () => {
    const response = await axios.get("/api/chats/user-chatrooms");
    return response.data;
  }
);

const initialState = {
  chatrooms: [],
  userChatrooms: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
      state.chatrooms = [];
      state.userChatrooms = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatrooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatrooms.fulfilled, (state, action) => {
        state.chatrooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatrooms.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchUserChatrooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserChatrooms.fulfilled, (state, action) => {
        state.userChatrooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserChatrooms.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default chatSlice.reducer;
