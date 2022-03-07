import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { Details, Home } from "../pages";
import { connectReducers } from "@politeiagui/core";
import { ticketvoteConstants } from "@politeiagui/ticketvote";
import homeReducer from "../pages/Home/homeSlice";
import detailsReducer from "../pages/Details/detailsSlice";

import {
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME,
  ThemeProvider,
  defaultDarkTheme,
  defaultLightTheme,
} from "pi-ui";
import "pi-ui/dist/index.css";

const themes = {
  [DEFAULT_LIGHT_THEME_NAME]: { ...defaultLightTheme },
  [DEFAULT_DARK_THEME_NAME]: { ...defaultDarkTheme },
};

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
        <ThemeProvider
          themes={themes}
          defaultThemeName={DEFAULT_LIGHT_THEME_NAME}
        >
          <Provider store={store}>
            <Home {...params} />
          </Provider>
        </ThemeProvider>,
        document.querySelector("#root")
      );
    },
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
  {
    path: "/record/:token",
    view: async (params) => {
      await connectReducers([
        ...ticketvoteConstants.reducersArray,
        detailsReducerObj,
      ]);
      return ReactDOM.render(
        <ThemeProvider
          themes={themes}
          defaultThemeName={DEFAULT_LIGHT_THEME_NAME}
        >
          <Provider store={store}>
            <Details {...params} />
          </Provider>
        </ThemeProvider>,

        document.querySelector("#root")
      );
    },
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
];
