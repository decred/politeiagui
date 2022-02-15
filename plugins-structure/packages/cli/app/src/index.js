import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { router } from "@politeiagui/core/router";

const root = document.querySelector("#root");

const App = () => {
  return <h1>__APP_NAME__ PAGE</h1>;
};

const Home = () => {
  return <h1>__APP_NAME__ HOME PAGE</h1>;
};

const routes = [
  {
    path: "/__APP_NAME__",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        root
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
  {
    path: "/",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <Home />
        </Provider>,
        root
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
];

router.init({ routes });
