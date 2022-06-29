import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME,
  ThemeProvider,
  defaultDarkTheme,
  defaultLightTheme,
  useTheme,
} from "pi-ui";
import { initialState, selectCurrentTheme } from "./themeSlice";
import { startThemeListener } from "./listeners";
import "./theme.css";

const themes = {
  [DEFAULT_DARK_THEME_NAME]: defaultDarkTheme,
  [DEFAULT_LIGHT_THEME_NAME]: defaultLightTheme,
};

startThemeListener();

function ThemeConsumer({ children }) {
  const { setThemeName, themeName } = useTheme();
  const currentTheme = useSelector(selectCurrentTheme);
  useEffect(() => {
    if (themeName !== currentTheme) {
      setThemeName(currentTheme);
    }
  }, [currentTheme, setThemeName, themeName]);

  return children;
}

export function UiTheme({ children }) {
  return (
    <ThemeProvider themes={themes} defaultThemeName={initialState.currentTheme}>
      <ThemeConsumer>{children}</ThemeConsumer>
    </ThemeProvider>
  );
}
