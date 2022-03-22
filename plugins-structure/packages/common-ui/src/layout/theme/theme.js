import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DEFAULT_LIGHT_THEME_NAME, ThemeProvider, useTheme } from "pi-ui";
import { selectCurrentTheme, selectThemes } from "./themeSlice";
import "./theme.css";

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
  const themes = useSelector(selectThemes);
  return (
    <ThemeProvider themes={themes} defaultThemeName={DEFAULT_LIGHT_THEME_NAME}>
      <ThemeConsumer>{children}</ThemeConsumer>
    </ThemeProvider>
  );
}
