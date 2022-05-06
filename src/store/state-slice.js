import { createSlice } from "@reduxjs/toolkit";

export const STATE = {
  STATE_UNDEFINED: 1,
  BUYING_LICENSE: 2,
};

const stateSlice = createSlice({
  name: "appState",
  initialState: { AppState: STATE.STATE_UNDEFINED },
  reducers: {
    setState(state, action) {
      state.AppState = action.payload;
    },
  },
});

export const stateAction = stateSlice.actions;

export default stateSlice;
