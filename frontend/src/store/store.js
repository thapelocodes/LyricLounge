import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import chatroomsReducer from "../features/chatroom/chatroomSlice";
import { configAPI } from "../utils/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    chat: chatroomsReducer,
  },
});

configAPI(store);
