import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { Details, Home } from "../pages";
import { connectReducers } from "@politeiagui/core";
import { ticketvoteConstants } from "@politeiagui/ticketvote";
import homeReducer from "../pages/Home/homeSlice";
import detailsReducer from "../pages/Details/detailsSlice";

export const homeReducerObj = {
  key: "home",
  reducer: homeReducer,
};

export const detailsReducerObj = {
  key: "details",
  reducer: detailsReducer,
};

export const routes = [
  {
    path: "/",
    view: async (params) => {
      await connectReducers([
        ...ticketvoteConstants.reducersArray,
        homeReducerObj,
      ]);
      return ReactDOM.render(
        <Provider store={store}>
          <Home {...params} />
        </Provider>,
        document.querySelector("#root")
      );
    },
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
  {
    path: "/records/:token",
    view: async (params) => {
      await connectReducers([
        ...ticketvoteConstants.reducersArray,
        detailsReducerObj,
      ]);
      return ReactDOM.render(
        <Provider store={store}>
          <Details {...params} />
        </Provider>,
        document.querySelector("#root")
      );
    },
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
];
