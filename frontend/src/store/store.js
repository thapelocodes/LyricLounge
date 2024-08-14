import { configureStore } from "@reduxjs/toolkit";
import authReducer, {
  logoutUser,
  tokenRefresher,
} from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import chatReducer from "../features/chat/chatSlice";
import apiBase, { configAPI } from "../utils/apiBase";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: apiBase } }),
});

configAPI(store, logoutUser, tokenRefresher);
