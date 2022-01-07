import { router } from "@politeiagui/core/router";
import { store } from "@politeiagui/core";
import { api } from "@politeiagui/core/api";
import { routes } from "../routes";

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
  // only start the app if can fetch api
  if (status === "succeeded") {
    router.init({ routes });
  }
}

initializeApp();
