import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatRooms = createAsyncThunk(
  "chatrooms/fetchChatRooms",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.user.token;
    try {
      const response = await axios.get("/api/chatrooms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.chatrooms;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chatroomsSlice = createSlice({
  name: "chatrooms",
  initialState: {
    chatrooms: [],
    loading: false,
    error: null,
  },
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
        state.error = action.payload;
      });
  },
});

export default chatroomsSlice.reducer;
