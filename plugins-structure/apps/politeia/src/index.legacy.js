import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Header } from "./components";
import { Provider } from "react-redux";
import { connectReducers, store } from "@politeiagui/core";
import { themeReducer } from "@politeiagui/common-ui/layout";
import { api } from "@politeiagui/core/api";
import { router } from "@politeiagui/core/router";
import { routes as coreRoutes } from "@politeiagui/core/routes";
import { routes as statisticsRoutes } from "@politeiagui/statistics";
import { routes as ticketvoteRoutes } from "@politeiagui/ticketvote";
import { routes as proposalsRoutes } from "./routes";
import { mergeRoutes } from "./utils/mergeRoutes";

import {
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME,
  ThemeProvider,
  defaultDarkTheme,
  defaultLightTheme,
} from "pi-ui";
import "pi-ui/dist/index.css";

const appRoot = document.querySelector("#app-root");

const themes = {
  [DEFAULT_LIGHT_THEME_NAME]: { ...defaultLightTheme },
  [DEFAULT_DARK_THEME_NAME]: { ...defaultDarkTheme },
};

// Define an element where the routes will be rendered
// Initialize router
function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  return <div id="root"></div>;
}

function getRoutes() {
  let routes = mergeRoutes(proposalsRoutes, coreRoutes, "core");
  routes = mergeRoutes(routes, statisticsRoutes, "statistics");
  routes = mergeRoutes(routes, ticketvoteRoutes, "ticketvote");
  return routes;
}

const routes = getRoutes();

let routerInitialized = false;

function initializeApp() {
  const unsubscribe = initializeApi();
  const apiStatus = api.selectStatus(store.getState());
  if (apiStatus === "succeeded") {
    unsubscribe();
  }
}

function initializeApi() {
  const apiStatus = api.selectStatus(store.getState());
  let unsubscribe;
  if (apiStatus === "idle") {
    unsubscribe = store.subscribe(handleApi);
    store.dispatch(api.fetch());
  }
  return unsubscribe;
}

function handleApi() {
  const state = store.getState();
  const status = state.api.status;
  if (!routerInitialized && status === "succeeded") {
    routerInitialized = true;
    router.init({ routes });
  }
}

connectReducers([{ key: "uiTheme", reducer: themeReducer }]).then(() => {
  return ReactDOM.render(
    <ThemeProvider themes={themes} defaultThemeName={DEFAULT_LIGHT_THEME_NAME}>
      <Provider store={store}>
        <Header />
        <App />
      </Provider>
    </ThemeProvider>,
    appRoot
  );
});
