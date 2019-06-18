import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Config from "src/Config";
import { defaultLightTheme, useTheme } from "pi-ui";
import { ReduxProvider } from "src/redux";
import Loader from "./Loader";
import Routes from "src/pages/Root";

const App = () => {
  useTheme(defaultLightTheme);
  return (
    <Config>
      <ReduxProvider>
        <Loader>
          <Router>
            <Routes />
          </Router>
        </Loader>
      </ReduxProvider>
    </Config>
  );
};

export default App;
