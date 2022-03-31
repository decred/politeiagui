import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { Details, Home } from "../pages";
import { connectReducers } from "@politeiagui/core";
import { ticketvoteConstants } from "@politeiagui/ticketvote";
import homeReducer from "../pages/Home/homeSlice";
import detailsReducer from "../pages/Details/detailsSlice";
import { createAppRoute } from "./utils";

export const homeReducerObj = {
  key: "home",
  reducer: homeReducer,
};

export const detailsReducerObj = {
  key: "details",
  reducer: detailsReducer,
};

export const routes = [
  createAppRoute({
    path: "/",
    reducers: [...ticketvoteConstants.reducersArray, homeReducerObj],
    Component: Home,
  }),
  createAppRoute({
    path: "/record/:token",
    reducers: [...ticketvoteConstants.reducersArray, detailsReducerObj],
    Component: Details,
  }),
  // {
  //   path: "/record/:token",
  //   view: async (params) => {
  //     await connectReducers([
  //       ...ticketvoteConstants.reducersArray,
  //       detailsReducerObj,
  //     ]);
  //     return ReactDOM.render(
  //       <ThemeProvider
  //         themes={themes}
  //         defaultThemeName={DEFAULT_LIGHT_THEME_NAME}
  //       >
  //         <Provider store={store}>
  //           <Details {...params} />
  //         </Provider>
  //       </ThemeProvider>,

  //       document.querySelector("#root")
  //     );
  //   },
  //   cleanup: () =>
  //     ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  // },
  {
    path: "/record/:token/raw",
    view: async ({ token }) => {
      await connectReducers([detailsReducerObj]);
      return ReactDOM.render(
        <Provider store={store}>
          <Details token={token} isRaw={true} />
        </Provider>,
        document.querySelector("#root")
      );
    },
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
];
