import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { ticketvoteConnectReducers } from "@politeiagui/ticketvote/helpers";
import Details from "../pages/Details";

const root = document.querySelector("#root");

export const routes = [
  {
    path: "/records/:token",
    view: async (params) => {
      await ticketvoteConnectReducers([
        "policy",
        "timestamps",
        "results",
        "details",
        "summaries",
      ]);
      return ReactDOM.render(
        <Provider store={store}>
          <Details {...params} />
        </Provider>,
        root
      );
    },
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
];
