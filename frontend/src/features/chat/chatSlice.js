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
    console.log("Public Chatrooms:", response.data);
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

export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async (chatroomId, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    const response = await axios.get(`/api/messages/${chatroomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetching chat history...");
    return { chatroomId, messages: response.data };
  }
);

export const fetchMessagesByMembership = createAsyncThunk(
  "chat/fetchMessagesByMembership",
  async (_, { getState }) => {
    const state = getState();
    const token = state.auth.token;
    const response = await axios.get("/api/messages", {
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
    const response = await axios.post(
      `/api/messages/`,
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
    const response = await axios.put(
      `/api/messages/${chatroomId}/mark-seen`,
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
      console.log("Add message action payload:", action.payload);
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
      // .addCase(fetchChatrooms.pending, (state) => {
      //   state.loading = true;
      // })
      .addCase(fetchChatrooms.fulfilled, (state, action) => {
        state.chatrooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatrooms.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // .addCase(fetchUserChatrooms.pending, (state) => {
      //   state.loading = true;
      // })
      .addCase(fetchUserChatrooms.fulfilled, (state, action) => {
        state.userChatrooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserChatrooms.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // .addCase(joinChatroom.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
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
      // .addCase(leaveChatroom.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
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
      // .addCase(createChatroom.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      .addCase(createChatroom.fulfilled, (state, action) => {
        const chatroom = action.payload;
        state.chatrooms.push(chatroom);
        state.userChatrooms.push(chatroom);
        state.loading = false;
      })
      .addCase(createChatroom.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // .addCase(fetchChatHistory.pending, (state) => {
      //   console.log("Fetching chat history...");
      //   state.loading = true;
      // })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { chatroomId, messages } = action.payload;
        state.messages[chatroomId] = messages;
        console.log("Chat history fetched!");
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        console.log("Error fetching chat history...");
        state.loading = false;
        state.error = action.error.message;
      })
      // .addCase(fetchMessagesByMembership.pending, (state) => {
      //   state.loading = true;
      // })
      .addCase(fetchMessagesByMembership.fulfilled, (state, action) => {
        state.loading = false;
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
      // .addCase(sendMessage.pending, () => {
      //   console.log("Sending message...");
      // })
      .addCase(sendMessage.fulfilled, (state, action) => {
        console.log("Message sent!");
        const message = action.payload;
        state.messages[message.chatroomId].push(message);
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(markMessagesAsSeen.pending, (state) => {
      //   state.loading = true;
      // })
      .addCase(markMessagesAsSeen.fulfilled, (state, action) => {
        const messagesArray = action.payload;
        console.log("Messages marked as seen:", messagesArray);
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
