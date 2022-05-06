import { configureStore } from "@reduxjs/toolkit";

import loaderSlice from "./loader-slice";
import stateSlice from "./state-slice";
import eventsSlice from "./events-slice";
import tabledataSlice from './tabledata-slice'
import modelSlice from './models-slice'
import languageSlice from "./language-slice";

const store = configureStore({
  reducer: {
    loader: loaderSlice.reducer,
    appState: stateSlice.reducer,
    event:eventsSlice.reducer,
    layout:tabledataSlice,
    model:modelSlice,
    language: languageSlice.reducer
  },
});

export default store;
