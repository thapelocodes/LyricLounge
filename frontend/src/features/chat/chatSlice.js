import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatrooms = createAsyncThunk(
  "chat/fetchChatrooms",
  async (_, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    const response = await axios.get("/api/chats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const fetchUserChatrooms = createAsyncThunk(
  "chat/fetchUserChatrooms",
  async (_, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    const response = await axios.get("/api/chats/user-chatrooms", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const joinChatroom = createAsyncThunk(
  "chat/joinChatroom",
  async (chatroomId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    try {
      const response = await axios.post(`/api/chats/${chatroomId}/join`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const leaveChatroom = createAsyncThunk(
  "chat/leaveChatroom",
  async (chatroomId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    try {
      const response = await axios.post(
        `/api/chats/${chatroomId}/leave`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createChatroom = createAsyncThunk(
  "chat/createChatroom",
  async ({ name, description }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    try {
      const response = await axios.post(
        "/api/chats",
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
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
      })
      .addCase(joinChatroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinChatroom.fulfilled, (state, action) => {
        const chatroom = action.payload;
        state.userChatrooms.push(chatroom);
        state.chatrooms = state.chatrooms.map((c) =>
          c._id === chatroom._id ? chatroom : c
        );
        state.loading = false;
      })
      .addCase(joinChatroom.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(leaveChatroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveChatroom.fulfilled, (state, action) => {
        const chatroom = action.payload;
        state.userChatrooms = state.userChatrooms.filter(
          (c) => c._id !== chatroom._id
        );
        state.chatrooms = state.chatrooms.map((c) =>
          c._id === chatroom._id ? chatroom : c
        );
        state.loading = false;
      })
      .addCase(leaveChatroom.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(createChatroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatroom.fulfilled, (state, action) => {
        state.chatrooms.push(action.payload);
        state.loading = false;
      })
      .addCase(createChatroom.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { resetChat } = chatSlice.actions;
export default chatSlice.reducer;
