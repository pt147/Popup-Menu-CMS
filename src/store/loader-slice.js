import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: { isShown: false },
  reducers: {
    showLoader(state){
      state.isShown = true
    },
    hideLoader(state){
      state.isShown = false
    }
  }
});

export const loaderAction = loaderSlice.actions;

export default loaderSlice;