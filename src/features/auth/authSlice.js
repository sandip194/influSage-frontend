
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const tokenFromCookie = Cookies.get("token");
const userIdFromCookie = Cookies.get("userId");
const roleFromCookie = Cookies.get("role");
const nameFromCookie = Cookies.get("name")

const initialState = {
  token: tokenFromCookie || null,
  userId: userIdFromCookie ? Number(userIdFromCookie) : null,
  name: nameFromCookie || null,
  role: roleFromCookie ? Number(roleFromCookie) : null,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {

      const { token, role, id, name } = action.payload;
      state.token = token;
      state.userId = id;
      state.name = name;
      state.role = role;

      const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000); // will expired in 1 hour
      Cookies.set("token", token, { expires: expiryDate });
      Cookies.set("role", role, { expires: expiryDate });
      Cookies.set("userId", id)
      Cookies.set("name", name)
    },
    setUserProfile: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.user = null;
      state.name = null
      state.role = null

      // Remove from cookies
      Cookies.remove("token");
      Cookies.remove("role");
    },
  },
});

export const { setCredentials, setUserProfile, logout } = authSlice.actions;

export default authSlice.reducer;
