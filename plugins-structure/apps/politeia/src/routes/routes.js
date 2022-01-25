import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
// import { ticketvoteConnectReducers } from "@politeiagui/ticketvote/helpers";
// import Details from "../pages/Details";
import { Home } from "../pages";
import { connectReducers } from "@politeiagui/core";
import { ticketvoteConstants } from "@politeiagui/ticketvote";

export const routes = [
  {
    path: "/",
    view: async (params) => {
      await connectReducers(ticketvoteConstants.reducersArray);
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
  // {
  //   path: "/records/:token",
  //   view: async (params) => {
  //     await ticketvoteConnectReducers([
  //       "policy",
  //       "timestamps",
  //       "results",
  //       "details",
  //       "summaries",
  //     ]);
  //     return ReactDOM.render(
  //       <Provider store={store}>
  //         <Details {...params} />
  //       </Provider>,
  //       root
  //     );
  //   },
  //   cleanup: () => ReactDOM.unmountComponentAtNode(root),
  // },
];
