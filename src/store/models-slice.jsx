import { createSlice, current } from '@reduxjs/toolkit'


export const tabledataSlice = createSlice({
    name: 'loader',
    initialState: { viewModel: true },
    reducers: {
      toggleViewModel(state){
        state.viewModel = !state.viewModel
      },
    }
  });

// Action creators are generated for each case reducer function
export const { toggleViewModel } = tabledataSlice.actions

export default tabledataSlice.reducer