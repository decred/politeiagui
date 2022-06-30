import React from "react";
import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import { Provider } from "react-redux";
import { ModalProvider } from "@politeiagui/common-ui";
import { UiTheme } from "@politeiagui/common-ui/layout";

export function createRouteView(Component) {
  return async (params) => {
    return ReactDOM.render(
      <Provider store={store}>
        <ModalProvider>
          <UiTheme>
            <Component {...params} />
          </UiTheme>
        </ModalProvider>
      </Provider>,
      document.querySelector("#root")
    );
  };
}
