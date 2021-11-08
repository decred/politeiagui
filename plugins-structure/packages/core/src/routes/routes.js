import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Records from "../records/pages/Records";
import Record from "../records/pages/Record";
import { store } from "../storeSetup";

export const routes = [
  {
    path: "/",
    title: "Home",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <Records />
        </Provider>,
        document.querySelector("#root")
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
  {
    path: "/records",
    title: "Records",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <Records />
        </Provider>,
        document.querySelector("#root")
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
  {
    path: "/records/:id",
    title: "Record",
    view: (params) => ReactDOM.render(<Record {...params} />, document.querySelector("#root")),
    cleanup: () => ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
  { path: "/settings", view: () => console.log("view settings") },
];
