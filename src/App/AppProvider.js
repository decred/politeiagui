import { connect } from "react-redux";
import React, { useMemo } from "react";
import { withRouter } from "react-router-dom";
import * as sel from "../selectors";

// This is temporary and will eventually be converted away from redux
// This approach is to ease the transition to hooks while keeping redux
// around and functioning until everything is converted
const appConnector = connect(
  sel.selectorMap({
    isCMS: sel.isCMS,
    loggedInAsEmail: sel.loggedInAsEmail
  })
);

export const AppContext = React.createContext();
export const useApp = () => React.useContext(AppContext);

export const AppProvider = withRouter(
  appConnector(
    ({ children, reduxStore, location, history, isCMS, loggedInAsEmail }) => {
      const rawValue = {
        redux: reduxStore,
        location,
        history,
        isCMS,
        loggedInAsEmail
      };
      const value = useMemo(() => rawValue, Object.values(rawValue));

      return (
        <AppContext.Provider value={value}>{children}</AppContext.Provider>
      );
    }
  )
);
