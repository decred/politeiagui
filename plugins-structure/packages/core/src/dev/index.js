import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "../storeSetup";
import { routes } from "../routes/routes";
import { router } from "../router/router";
import { api } from "../api";
import {
  defaultLightTheme,
  ThemeProvider,
  defaultDarkTheme,
  DEFAULT_LIGHT_THEME_NAME,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import "pi-ui/dist/index.css";

const appRoot = document.querySelector("#app-root");

const themes = {
  [DEFAULT_LIGHT_THEME_NAME]: { ...defaultLightTheme },
  [DEFAULT_DARK_THEME_NAME]: { ...defaultDarkTheme }
};

// Define an element where the routes will be rendered
// Initialize router
function App() {
  useEffect(() => {
    initializeApp()
  }, []);
  return (
  <div id="root"></div>
  )
}

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
  const status = api.selectStatus(state);
  if (status === "loading") {
    document.querySelector("#root").innerHTML = "<h1>Loading api...</h1>";
  }
  if (status === "succeeded" && !routerInitialized) {
    routerInitialized = true;
    router.init({ routes });
  }
}

ReactDOM.render(
  <ThemeProvider
      themes={themes}
      defaultThemeName={DEFAULT_LIGHT_THEME_NAME}>
  <Provider store={store}>
    <App />
  </Provider>
  </ThemeProvider>,
  appRoot
);
