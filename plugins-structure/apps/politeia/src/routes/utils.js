import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { connectReducers } from "@politeiagui/core";
import { UiTheme, themeReducer } from "@politeiagui/common-ui/layout";

export function createAppRoute({
  path,
  reducers,
  Component,
  rootId = "#root",
}) {
  return {
    path,
    view: async (params) => {
      await connectReducers([
        ...(reducers || []),
        { key: "uiTheme", reducer: themeReducer },
      ]);
      return ReactDOM.render(
        <Provider store={store}>
          <UiTheme>
            <Component {...params} />
          </UiTheme>
        </Provider>,
        document.querySelector(rootId)
      );
    },
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector(rootId)),
  };
}
