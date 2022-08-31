import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "../storeSetup";
import { routes } from "./routes";
import App from "./app";

App.init({ routes });

ReactDOM.render(
  <Provider store={store}>
    <div id="root" />
  </Provider>,
  document.querySelector("#app-root")
);
