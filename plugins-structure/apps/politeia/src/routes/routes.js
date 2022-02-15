import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { Home } from "../pages";
import { connectReducers } from "@politeiagui/core";
import { ticketvoteConstants } from "@politeiagui/ticketvote";
import homeReducer from "../pages/Home/homeSlice";

export const homeReducerObj = {
  key: "home",
  reducer: homeReducer,
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
];
