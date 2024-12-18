import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiBase from "../../utils/apiBase";

export const fetchChatrooms = createAsyncThunk(
  "chat/fetchChatrooms",
  async (_, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    const response = await apiBase.get("/chats", {
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
    const response = await apiBase.get("/chats/user-chatrooms", {
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
      const response = await apiBase.post(`/chats/${chatroomId}/join`, null, {
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
      const response = await apiBase.post(`/chats/${chatroomId}/leave`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const response = await apiBase.post(
        "/chats",
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

export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async (chatroomId, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    const response = await apiBase.get(`/messages/${chatroomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { chatroomId, messages: response.data };
  }
);

export const fetchMessagesByMembership = createAsyncThunk(
  "chat/fetchMessagesByMembership",
  async (_, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    const response = await apiBase.get("/messages", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatroomId, content }, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    const response = await apiBase.post(
      `/messages/`,
      { chatroomId, content },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

export const markMessagesAsSeen = createAsyncThunk(
  "chat/markMessagesAsSeen",
  async (chatroomId, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    const userId = state.auth.user._id;
    const response = await apiBase.put(
      `/messages/${chatroomId}/mark-seen`,
      { userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

const initialState = {
  chatrooms: [],
  userChatrooms: [],
  messages: {},
  notifications: {},
  openChatroomId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChat: (state) => {
      return {
        ...state,
        chatrooms: [],
        userChatrooms: [],
        error: null,
        openChatroomId: null,
      };
    },
    setOpenChatroom: (state, action) => {
      return {
        ...state,
        openChatroomId: action.payload,
        notifications: {
          ...state.notifications,
          [action.payload]: 0,
        },
      };
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const chatroomId = message.chatroomId;
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatroomId]: [...(state.messages[chatroomId] || []), message],
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatrooms.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchChatrooms.fulfilled, (state, action) => {
        state.chatrooms = action.payload;
      })
      .addCase(fetchChatrooms.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchUserChatrooms.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserChatrooms.fulfilled, (state, action) => {
        state.userChatrooms = action.payload;
      })
      .addCase(fetchUserChatrooms.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(joinChatroom.pending, (state) => {
        state.error = null;
      })
      .addCase(joinChatroom.fulfilled, (state, action) => {
        const chatroom = action.payload;
        state.userChatrooms.push(chatroom);
        state.chatrooms = state.chatrooms.map((c) =>
          c._id === chatroom._id ? chatroom : c
        );
      })
      .addCase(joinChatroom.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(leaveChatroom.pending, (state) => {
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
      })
      .addCase(leaveChatroom.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(createChatroom.pending, (state) => {
        state.error = null;
      })
      .addCase(createChatroom.fulfilled, (state, action) => {
        const chatroom = action.payload;
        state.chatrooms.push(chatroom);
        state.userChatrooms.push(chatroom);
        state.loading = false;
      })
      .addCase(createChatroom.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchChatHistory.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        const { chatroomId, messages } = action.payload;
        state.messages[chatroomId] = messages;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchMessagesByMembership.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchMessagesByMembership.fulfilled, (state, action) => {
        const { messagesByChatroom, userId } = action.payload;
        const notifications = {};

        for (const chatroomId in messagesByChatroom) {
          const messages = messagesByChatroom[chatroomId];
          state.messages[chatroomId] = messages;
          const unseenCount = messages.filter(
            (message) =>
              message.receivedBy.includes(userId) &&
              !message.seenBy.includes(userId)
          ).length;
          notifications[chatroomId] = unseenCount;
        }

        state.notifications = notifications;
      })
      .addCase(fetchMessagesByMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        state.messages[message.chatroomId].push(message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markMessagesAsSeen.pending, (state) => {
        state.error = null;
      })
      .addCase(markMessagesAsSeen.fulfilled, (state, action) => {
        const messagesArray = action.payload;
        state.messages[state.openChatroomId] = messagesArray;
      })
      .addCase(markMessagesAsSeen.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const {
  resetChat,
  setOpenChatroom,
  addMessage,
  clearNotifications,
  updateNotifications,
} = chatSlice.actions;
export default chatSlice.reducer;
