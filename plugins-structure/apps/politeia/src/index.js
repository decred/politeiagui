import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
// Theme
import { UiTheme } from "@politeiagui/common-ui/layout";
import { ProgressBar, Toast } from "@politeiagui/common-ui";
// Components
import { Error, Header } from "./components";
// App
import App from "./app";
import { routes } from "./routes";
import ErrorView from "./pages/Error";

try {
  ReactDOM.render(
    <Provider store={store}>
      <UiTheme>
        <Header />
        <ProgressBar />
        <div id="root" />
        <Toast />
      </UiTheme>
    </Provider>,
    document.querySelector("#app-root")
  );
  await App.init({ routes, errorView: ErrorView });
} catch (e) {
  ReactDOM.render(<Error error={e} />, document.querySelector("#app-root"));
}
