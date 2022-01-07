import React from "react";
import {
  defaultLightTheme,
  ThemeProvider,
  defaultDarkTheme,
  DEFAULT_LIGHT_THEME_NAME,
  DEFAULT_DARK_THEME_NAME,
} from "pi-ui";
import "pi-ui/dist/index.css";

// import SourceSansProLight from "./assets/fonts/source-sans-pro/SourceSansPro-Light.ttf";
// import SourceSansProRegular from "./assets/fonts/source-sans-pro/SourceSansPro-Regular.ttf";
// import SourceSansProSemiBold from "./assets/fonts/source-sans-pro/SourceSansPro-SemiBold.ttf";

const themeCustomVariables = {
  "font-family-text": "Source Sans Pro",
};
const themes = {
  [DEFAULT_LIGHT_THEME_NAME]: { ...defaultLightTheme, ...themeCustomVariables },
  [DEFAULT_DARK_THEME_NAME]: { ...defaultDarkTheme, ...themeCustomVariables },
};
const fonts = [
  {
    "font-family": "Source Sans Pro",
    // src: `url(${SourceSansProLight}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-light"],
    "font-style": "normal",
    "font-display": "swap",
  },
  {
    "font-family": "Source Sans Pro",
    // src: `url(${SourceSansProRegular}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-regular"],
    "font-style": "normal",
    "font-display": "swap",
  },
  {
    "font-family": "Source Sans Pro",
    // src: `url(${SourceSansProSemiBold}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-semi-bold"],
    "font-style": "normal",
    "font-display": "swap",
  },
];

export const PiThemeWrapper = ({ children }) => {
  return (
    <ThemeProvider
      themes={themes}
      defaultThemeName={DEFAULT_LIGHT_THEME_NAME}
      fonts={fonts}
    >
      {children}
    </ThemeProvider>
  );
};
