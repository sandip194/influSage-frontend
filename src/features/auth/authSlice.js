import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Get from cookies

const userIdFromCookie = Cookies.get("userId");
const tokenFromCookie = Cookies.get("token");
const roleFromCookie = Cookies.get("role");
const nameFromCookie = Cookies.get("name");
const pCodeFromCookie = Cookies.get("p_code");

const initialState = {
  userId: userIdFromCookie ? Number(userIdFromCookie) : null,
  token: tokenFromCookie || null,
  name: nameFromCookie || null,
  role: roleFromCookie ? Number(roleFromCookie) : null,
  p_code: pCodeFromCookie || null, // ✅ New
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, role, id, name, p_code } = action.payload;
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

      state.userId = id;
      state.token = token;
      state.name = name;
      state.role = role;
      state.p_code = p_code || null;

      Cookies.set("userId", id, { expires: new Date(expiresAt) });
      Cookies.set("token", token, { expires: new Date(expiresAt) });
      Cookies.set("role", role, { expires: new Date(expiresAt) });
      Cookies.set("name", name, { expires: new Date(expiresAt) });
      Cookies.set("tokenExpiry", expiresAt, { expires: new Date(expiresAt) });

      if (p_code) {
        Cookies.set("p_code", p_code, { expires: new Date(expiresAt) });
      }
    },

    setUserProfile: (state, action) => {
      state.user = action.payload;
    },

    logout: (state) => {

      state.userId = null;
      state.token = null;
      state.user = null;
      state.name = null;
      state.role = null;
      state.p_code = null; // ✅ Clear on logout

      // Remove cookies
      Cookies.remove("userId");
      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("name");
      Cookies.remove("p_code"); // ✅ Remove cookie
    },
  },
});

export const { setCredentials, setUserProfile, logout } = authSlice.actions;

export default authSlice.reducer;
