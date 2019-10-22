import React from "react";
import { Router } from "src/componentsv2/Router";
import Config from "src/Config";
import { defaultLightTheme, useTheme } from "pi-ui";
import { ReduxProvider } from "src/redux";
import Loader from "./Loader";
import Routes from "src/pages/Root";
import { UserSessionChecker } from "src/containers/User/SessionChecker";
import { LoginModalProvider } from "src/containers/User/Login";
import Onboard from "src/containers/User/Onboard";
import StaticContentProvider from "src/containers/StaticContent";
import "pi-ui/dist/index.css";

const App = () => {
  useTheme(defaultLightTheme);
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
