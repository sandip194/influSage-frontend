import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loadingCount: 0,
  },
  reducers: {
    showLoader: (state) => {
      state.loadingCount += 1;
    },
    hideLoader: (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
  },
});

export const { showLoader, hideLoader } = uiSlice.actions;
export default uiSlice.reducer;
