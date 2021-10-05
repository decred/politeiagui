import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { api } from "@politeiagui/core/api";
import { router, navigateTo } from "@politeiagui/core/router";
import { routes as coreRoutes } from "@politeiagui/core/routes";
import { routes as statisticsRoutes } from "@politeiagui/statistics";
import { recordsInventory } from "@politeiagui/core/records/inventory";

const root = document.querySelector("#root");

const App = () => {
  const inv = recordsInventory.useFetch({
    recordsState: "vetted",
    status: "public",
  });
  console.log(inv);
  return <h1>Hey</h1>;
};

const routes = [
  {
    path: "/my-app-shell",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        root
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
  ...coreRoutes,
  ...statisticsRoutes,
];

let routerInitialized = false;

function initializeApp() {
  document.addEventListener("DOMContentLoaded", () => {
    // make anchor tags work
    document.body.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(e.target.href, routes);
      }
    });
    const unsubscribe = initializeApi();
    const apiStatus = api.selectStatus(store.getState());
    if (apiStatus === "succeeded") {
      unsubscribe();
    }
  });
  // router history
  window.addEventListener("popstate", () => router(routes));
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
    router(routes);
  }
}

initializeApp();
