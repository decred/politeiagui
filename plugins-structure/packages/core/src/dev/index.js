import { store } from "../storeSetup";
import { routes } from "../routes/routes";
import { router, navigateTo } from "../router/router";
import { api } from "../api";

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
