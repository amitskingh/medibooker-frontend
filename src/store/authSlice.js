import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  access: localStorage.getItem("access") || null,
  refresh: localStorage.getItem("refresh") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { user, access, refresh } = action.payload;
      state.user = user;
      state.access = access;
      state.refresh = refresh;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access", access);
      if (refresh) localStorage.setItem("refresh", refresh);
    },
    logout(state) {
      state.user = null;
      state.access = null;
      state.refresh = null;
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
