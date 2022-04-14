import { resetTheme, selectCurrentTheme, setCurrentTheme } from "./themeSlice";

export { default as themeReducer } from "./themeSlice";
export * from "./theme";
export * from "./ThemeToggle";

export const theme = {
  reset: resetTheme,
  select: selectCurrentTheme,
  set: setCurrentTheme,
};
