import { configureStore } from "@reduxjs/toolkit";
import authReducer, {
  logoutUser,
  tokenRefresher,
} from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import chatReducer from "../features/chat/chatSlice";
import apiBase, { configAPI } from "../utils/apiBase";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    profile: profileReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: apiBase } }),
});

export const persistor = persistStore(store, {});

configAPI(store, logoutUser, tokenRefresher);
