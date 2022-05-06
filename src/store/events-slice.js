import { createSlice } from "@reduxjs/toolkit";

const eventsSlice = createSlice({
  name: "selectedEvent",
  initialState: { eventName: "" },
  reducers: {
    setName(state, action) {
      state.eventName = action.payload;
    },
  },
});

export const eventAction = eventsSlice.actions;

export default eventsSlice;
