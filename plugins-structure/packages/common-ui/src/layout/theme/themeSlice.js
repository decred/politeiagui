import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import { getFromLocalStorage } from "@politeiagui/core/storage";

const currentThemeFromLS = getFromLocalStorage("uiTheme/currentTheme");

export const initialState = {
  currentTheme: currentThemeFromLS || DEFAULT_LIGHT_THEME_NAME,
};

const themeSlice = createSlice({
  name: "uiTheme",
  initialState,
  reducers: {
    setCurrentTheme(state, action) {
      state.currentTheme = action.payload;
    },
    resetTheme(state) {
      state.currentTheme = DEFAULT_LIGHT_THEME_NAME;
    },
  },
});

export const { setCurrentTheme, resetTheme } = themeSlice.actions;
export const selectCurrentTheme = (state) => state.uiTheme.currentTheme;

export default themeSlice.reducer;
