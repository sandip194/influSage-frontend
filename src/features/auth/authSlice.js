import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Get from cookies
const tokenFromCookie = Cookies.get("token");
const userIdFromCookie = Cookies.get("userId");
const roleFromCookie = Cookies.get("role");
const nameFromCookie = Cookies.get("name");
const pCodeFromCookie = Cookies.get("p_code");

const initialState = {
  token: tokenFromCookie || null,
  userId: userIdFromCookie ? Number(userIdFromCookie) : null,
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

      state.token = token;
      state.userId = id;
      state.name = name;
      state.role = role;
      state.p_code = p_code || null; // ✅ Set in state

      const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour

      // ✅ Set cookies
      Cookies.set("token", token, { expires: expiryDate });
      Cookies.set("role", role, { expires: expiryDate });
      Cookies.set("userId", id, { expires: expiryDate });
      Cookies.set("name", name, { expires: expiryDate });
      if (p_code) {
        Cookies.set("p_code", p_code, { expires: expiryDate });
      }
    },

    setUserProfile: (state, action) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.user = null;
      state.name = null;
      state.role = null;
      state.p_code = null; // ✅ Clear on logout

      // Remove cookies
      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("userId");
      Cookies.remove("name");
      Cookies.remove("p_code"); // ✅ Remove cookie
    },
  },
});

export const { setCredentials, setUserProfile, logout } = authSlice.actions;

export default authSlice.reducer;
