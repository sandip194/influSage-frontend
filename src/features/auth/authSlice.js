import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { decodeToken } from "../../app/decodeToken";

const tokenFromCookie = Cookies.get("token");
const decoded = tokenFromCookie ? decodeToken(tokenFromCookie) : null;

const initialState = {
  userId: decoded?.id || null,
  token: tokenFromCookie || null,
  name: decoded?.name || null,
  role: decoded?.role || null,
  p_code: decoded?.p_code || null,
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;
      const decoded = decodeToken(token);

      if (!decoded) return;

      state.userId = decoded.id;
      state.role = decoded.role;
      state.name = decoded.name;
      state.p_code = decoded.p_code;
      state.token = token;

      Cookies.set("token", token);
    },

    logout: (state) => {
      state.userId = null;
      state.token = null;
      state.role = null;
      state.name = null;
      state.p_code = null;

      Cookies.remove("token");
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
