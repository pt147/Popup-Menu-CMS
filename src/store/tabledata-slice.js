import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  layout: [],
};

export const tabledataSlice = createSlice({
  name: "tableLayout",
  initialState,
  reducers: {
    setLayoutRedux: (state, action) => {
      state.layout = action.payload;
    },
    updateLayoutRedux: (state, action) => {
      let row = action.payload.row;
      let col = action.payload.column;

      let newArray = [...current(state.layout)];
      let newrow = [...newArray[row]];
      let newcolumn = { ...newrow[col], isBooked: true };

      //Remove object from array...........................................
      let removerArray = [];
      newArray.filter((res) => {
        if (res[col].row === row && res[col].column === col) {
          let temp = [...res];
          temp.splice(col, 1);
          removerArray.push(temp);
        } else {
          removerArray.push(res);
        }
      });

      //Add Updated object to array...........................................
      let finalOut = [];

      removerArray.filter((res, index) => {
        if (index == row) {
          res.splice(col, 0, newcolumn);
          finalOut.push(res);
        } else {
          finalOut.push(res);
        }
      });

      //Assign finalaout to state........................................
      //console.log(finalOut);
      state.layout = finalOut;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLayoutRedux, updateLayoutRedux } = tabledataSlice.actions;

export default tabledataSlice.reducer;
