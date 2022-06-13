import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { connectReducers } from "@politeiagui/core";
import { UiTheme } from "@politeiagui/common-ui/layout";
import { ModalProvider } from "@politeiagui/common-ui";

export function createAppRoute({
  path,
  reducers,
  Component,
  rootId = "#root",
}) {
  return {
    path,
    view: async (params) => {
      await connectReducers(reducers || []);
      return ReactDOM.render(
        <Provider store={store}>
          <ModalProvider>
            <UiTheme>
              <Component {...params} />
            </UiTheme>
          </ModalProvider>
        </Provider>,
        document.querySelector(rootId)
      );
    },
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector(rootId)),
  };
}
