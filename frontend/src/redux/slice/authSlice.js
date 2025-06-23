import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 isUserLoggedIn: localStorage.getItem("user") ? true : false,
 email: null,
 userName: null,
 userId: null,
};

const authSlice = createSlice({
 name: "auth",
 initialState,
 reducers: {
  setActiveUser: (state, action) => {
   const { email, userName, userId, token } = action.payload;
   state.isUserLoggedIn = true;
   state.email = email;
   state.userName = userName;
   state.userId = userId;
   localStorage.setItem("token", token);
   localStorage.setItem("user", JSON.stringify({ email, userName, userId }));
  },
  removeActiveUser: (state) => {
   state.isUserLoggedIn = false;
   state.email = null;
   state.userName = null;
   state.userId = null;
   localStorage.removeItem("token");
   localStorage.removeItem("user");
  },
 },
});

export const selectAuthSlice = (store) => store.auth;

export const { setActiveUser, removeActiveUser } = authSlice.actions;

export default authSlice.reducer;
