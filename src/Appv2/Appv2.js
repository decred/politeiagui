import React from "react";
import { Router } from "src/componentsv2/Router";
import Config from "src/Config";
import { defaultLightTheme, useTheme, useFont } from "pi-ui";
import { ReduxProvider } from "src/redux";
import Loader from "./Loader";
import Routes from "src/pages/Root";
import { UserSessionChecker } from "src/containers/User/SessionChecker";
import { LoginModalProvider } from "src/containers/User/Login";
import Onboard from "src/containers/User/Onboard";
import StaticContentProvider from "src/containers/StaticContent";
import "pi-ui/dist/index.css";

import SourceSansProLight from "../assets/fonts/source-sans-pro/SourceSansPro-Light.ttf";
import SourceSansProRegular from "../assets/fonts/source-sans-pro/SourceSansPro-Regular.ttf";
import SourceSansProSemiBold from "../assets/fonts/source-sans-pro/SourceSansPro-SemiBold.ttf";

const fontConfig = {
  fontFamilyText: "Source Sans Pro",
  regularUrl: SourceSansProRegular,
  semiBoldUrl: SourceSansProSemiBold,
  lightUrl: SourceSansProLight,
  format: "truetype"
};

const App = () => {
  const [theme, setTheme] = useTheme();
  if (!theme) {
    setTheme(defaultLightTheme);
  }
  useFont(fontConfig);
  return (
    <Config>
      <ReduxProvider>
        <Loader>
          <StaticContentProvider>
            <Onboard />
            <Router>
              <LoginModalProvider>
                <UserSessionChecker>
                  <Routes />
                </UserSessionChecker>
              </LoginModalProvider>
            </Router>
          </StaticContentProvider>
        </Loader>
      </ReduxProvider>
    </Config>
  );
};

export default App;
