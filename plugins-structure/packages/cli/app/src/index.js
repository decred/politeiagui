import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import App from "./app";

const root = document.querySelector("#root");

const AppPage = () => {
  return <h1>__APP_NAME__ PAGE</h1>;
};

const Home = () => {
  return <h1>__APP_NAME__ HOME PAGE</h1>;
};

function cleanup() {
  return ReactDOM.unmountComponentAtNode(root);
}

const routes = [
  App.createRoute({
    path: "/__APP_NAME__",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <AppPage />
        </Provider>,
        root
      ),
    cleanup,
    initializerIds: [
      /* Pass initializerIds to setup your route to consume some plugin */
    ],
  }),
  App.createRoute({
    path: "/",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <Home />
        </Provider>,
        root
      ),
    cleanup,
    initializerIds: [
      /* Pass initializerIds to setup your route to consume some plugin */
    ],
  }),
];

App.init({ routes });
