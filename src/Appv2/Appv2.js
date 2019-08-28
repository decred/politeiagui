import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Config from "src/Config";
import { defaultLightTheme, useTheme } from "pi-ui";
import { ReduxProvider } from "src/redux";
import Loader from "./Loader";
import Routes from "src/pages/Root";
import { UserSessionChecker } from "src/containers/User/SessionChecker";
import { LoginModalProvider } from "src/containers/User/Login";
import StaticContentProvider from "src/containers/StaticContent";

const App = () => {
  useTheme(defaultLightTheme);
  return (
    <Config>
      <ReduxProvider>
        <Loader>
          <StaticContentProvider>
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
