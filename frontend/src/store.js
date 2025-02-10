import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
};

const Slice = createSlice({
  name: "lightdark",
  initialState,
  reducers: {
    toggleLightDark: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

const store = configureStore({
  reducer: {
    lightdark: Slice.reducer,
  },
});

export const { toggleLightDark } = Slice.actions;
export default store;
