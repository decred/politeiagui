import { createSlice } from "@reduxjs/toolkit";
import {
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME,
  defaultDarkTheme,
  defaultLightTheme,
} from "pi-ui";

const initialState = {
  themes: {
    [DEFAULT_DARK_THEME_NAME]: defaultDarkTheme,
    [DEFAULT_LIGHT_THEME_NAME]: defaultLightTheme,
  },
  currentTheme: DEFAULT_LIGHT_THEME_NAME,
};

const rootSlice = createSlice({
  name: "uiTheme",
  initialState,
  reducers: {
    setCurrentTheme(state, action) {
      state.currentTheme = action.payload;
    },
    resetTheme(state) {
      state.currentTheme = initialState.currentTheme;
      state.themes = initialState.themes;
    },
    addTheme(state, action) {
      const { key, value } = action.payload;
      state.themes = { ...state.themes, [key]: value };
    },
  },
});

export const { setCurrentTheme, resetTheme, addTheme } = rootSlice.actions;

export const selectThemes = (state) => state.uiTheme.themes;
export const selectThemeNames = (state) => Object.keys(state.uiTheme.themes);
export const selectCurrentTheme = (state) => state.uiTheme.currentTheme;
export const selectCurrentThemeValues = (state) =>
  state.uiTheme.themes[state.uiTheme.currentTheme];

export default rootSlice.reducer;
