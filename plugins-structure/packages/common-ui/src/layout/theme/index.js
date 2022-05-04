import { resetTheme, selectCurrentTheme, setCurrentTheme } from "./themeSlice";

export { default as themeReducer } from "./themeSlice";
export * from "./theme";

export const theme = {
  select: selectCurrentTheme,
  set: setCurrentTheme,
  reset: resetTheme,
};
