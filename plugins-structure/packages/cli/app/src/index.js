import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { mergeRoutes } from "@politeiagui/core/router";
import App from "./app";
// You can import routes from plugins and merge them with your app routes. See
// the example below for more information
import { routes as statisticsRoutes } from "@politeiagui/statistics";

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

const appRoutes = [
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
    setupServices: [
      /* Pass setupServices to setup your route to consume some plugin. You can also add listeners with action and injectEffect */
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
    setupServices: [
      /* Pass setupServices to setup your route to consume some plugin. You can also add listeners with action and injectEffect */
    ],
  }),
];

// You can combine different routes arrays using the `mergeRoutes` util from the
// core router.
const routes = mergeRoutes(appRoutes, statisticsRoutes);

App.init({ routes });
