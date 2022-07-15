import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
// Theme
import { UiTheme } from "@politeiagui/common-ui/layout";
// Components
import { Header } from "./components";
// App
import App from "./app";
import { routes } from "./routes";

App.init({ routes });

ReactDOM.render(
  <Provider store={store}>
    <UiTheme>
      <Header />
      <div id="root" />
    </UiTheme>
  </Provider>,
  document.querySelector("#app-root")
);
