import React from "react";
import { Provider } from "react-redux";
import { reduxContext } from "./hooks";
import configureStore from "./configureStore";

const store = configureStore();

const ReduxProvider = ({ children }) => (
  <Provider context={reduxContext} store={store}>
    {children}
  </Provider>
);

export default ReduxProvider;
