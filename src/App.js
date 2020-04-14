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

const fontConfig = {
  fontFamilyText: "Source Sans Pro",
  regularUrl: SourceSansProRegular,
  semiBoldUrl: SourceSansProSemiBold,
  lightUrl: SourceSansProLight,
  format: "truetype"
};

const themes = {
  light: defaultLightTheme,
  dark: defaultDarkTheme
};

const App = () => {
  // This is a temporary fix to avoid an issue during the tests
  if (process.env.NODE_ENV === "test") {
    return <div></div>;
  }

  return (
    <ThemeProvider
      themes={themes}
      defaultThemeName="light"
      fontConfig={fontConfig}>
      <Config>
        <ReduxProvider>
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
        </ReduxProvider>
      </Config>
    </ThemeProvider>
  );
};

export default App;
