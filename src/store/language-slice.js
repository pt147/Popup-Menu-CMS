import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "language",
  initialState: { language: localStorage.getItem("lan") ?? 'en' },
  reducers: {
    setLanguage(state, action) {
      localStorage.setItem("lan", action.payload);
      state.language = action.payload;
    },
  },
});

export const languageActions = languageSlice.actions;

export default languageSlice;
