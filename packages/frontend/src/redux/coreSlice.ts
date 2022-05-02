import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Snackbar } from "../types/snackbar";
import { RootState } from "./store";

export interface CoreState {
  snackbar?: Snackbar;
}

const initialState: CoreState = {
  snackbar: undefined,
};

export const coreSlice = createSlice({
  name: "core",
  initialState,
  reducers: {
    displaySnackbar: (state, action: PayloadAction<Snackbar>) => {
      state.snackbar = action.payload;
    },
    resetSnackbar: (state) => {
      state.snackbar = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { displaySnackbar, resetSnackbar } = coreSlice.actions;

export const selectSnackbar = (state: RootState) => state.core.snackbar;

export default coreSlice.reducer;
