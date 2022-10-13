import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
// Theme
import { UiTheme } from "@politeiagui/common-ui/layout";
import { ProgressBar } from "@politeiagui/common-ui";
// Components
import { Header } from "./components";
// App
import App from "./app";
import { routes } from "./routes";
import ErrorView from "./pages/Error";

App.init({ routes, errorView: ErrorView });

ReactDOM.render(
  <Provider store={store}>
    <UiTheme>
      <Header />
      <ProgressBar />
      <div id="root" />
    </UiTheme>
  </Provider>,
  document.querySelector("#app-root")
);
