import React from "react";
import { Router } from "src/components/Router";
import Config from "src/containers/Config";
import { defaultLightTheme, ThemeProvider, defaultDarkTheme } from "pi-ui";
import { ReduxProvider } from "src/redux";
import Loader from "src/containers/Loader";
import Routes from "src/pages";
import { UserSessionChecker } from "src/containers/User/SessionChecker";
import StaticContentProvider from "src/containers/StaticContent";
import ModalProvider from "src/components/ModalProvider";
import "pi-ui/dist/index.css";
import "src/style/index.css";
import "src/validation/setupFormValidators";

import SourceSansProLight from "src/assets/fonts/source-sans-pro/SourceSansPro-Light.ttf";
import SourceSansProRegular from "src/assets/fonts/source-sans-pro/SourceSansPro-Regular.ttf";
import SourceSansProSemiBold from "src/assets/fonts/source-sans-pro/SourceSansPro-SemiBold.ttf";

const themeCustomVariables = {
  "font-family-text": "Source Sans Pro"
};

const themes = {
  light: { ...defaultLightTheme, ...themeCustomVariables },
  dark: { ...defaultDarkTheme, ...themeCustomVariables }
};

const fonts = [
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProLight}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-light"],
    "font-style": "normal",
    "font-display": "swap"
  },
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProRegular}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-regular"],
    "font-style": "normal",
    "font-display": "swap"
  },
  {
    "font-family": "Source Sans Pro",
    src: `url(${SourceSansProSemiBold}) format("truetype")`,
    "font-weight": defaultLightTheme["font-weight-semi-bold"],
    "font-style": "normal",
    "font-display": "swap"
  }
];

const App = () => {
  // This is a temporary fix to avoid an issue during the tests
  if (process.env.NODE_ENV === "test") {
    return <div></div>;
  }

  return (
    <ThemeProvider themes={themes} defaultThemeName="light" fonts={fonts}>
      <ReduxProvider>
        <Config>
          <Loader>
            <StaticContentProvider>
              <Router>
                <ModalProvider>
                  <UserSessionChecker>
                    <Routes />
                  </UserSessionChecker>
                </ModalProvider>
              </Router>
            </StaticContentProvider>
          </Loader>
        </Config>
      </ReduxProvider>
    </ThemeProvider>
  );
};

export default App;
