
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const tokenFromCookie = Cookies.get("token");
const userIdFromCookie = Cookies.get("userId");
const roleFromCookie = Cookies.get("role");
const firstNameFromCookie = Cookies.get("firstName")
const lastNameFromCookie = Cookies.get("lastName")

const initialState = {
  token: tokenFromCookie || null,
  userId: userIdFromCookie ? Number(userIdFromCookie) : null,
  firstName: firstNameFromCookie || null,
  lastName: lastNameFromCookie || null,
  role: roleFromCookie ? Number(roleFromCookie) : null,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
     
      const { token, role, id, firstName, lastName } = action.payload;
      state.token = token;
      state.userId = id;
      state.firstName = firstName;
      state.lastName = lastName;
      state.role = role;

      Cookies.set("token", token, { expires: 1 }); // 1 day expiry
      Cookies.set("role", role, { expires: 1 });
      Cookies.set("userId", id)
      Cookies.set("firstName", firstName)
      Cookies.set("lastName", lastName)
    },
    setUserProfile: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.user = null;
      state.firstName = null
      state.lastName = null
      state.role = null

      // Remove from cookies
      Cookies.remove("token");
      Cookies.remove("role");
    },
  },
});

export const { setCredentials, setUserProfile, logout } = authSlice.actions;

export default authSlice.reducer;
