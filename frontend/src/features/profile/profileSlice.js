import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile:
    JSON.parse(sessionStorage.getItem("profile")) ||
    JSON.parse(localStorage.getItem("profile")) ||
    null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      sessionStorage.setItem("profile", JSON.stringify(action.payload));
      localStorage.setItem("profile", JSON.stringify(action.payload));
    },
    clearProfile: (state) => {
      state.profile = null;
      sessionStorage.removeItem("profile");
      localStorage.removeItem("profile");
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
