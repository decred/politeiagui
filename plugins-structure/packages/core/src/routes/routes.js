import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Records } from "../records/ui/Records";
import { Record } from "../records/ui/Record";
import { store } from "../storeSetup";

const root = document.querySelector("#root");

export const routes = [
  {
    path: "/",
    title: "Home",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <Records />
        </Provider>,
        root
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
  {
    path: "/records",
    title: "Records",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <Records />
        </Provider>,
        root
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
  {
    path: "/records/:id",
    title: "Record",
    view: (params) => ReactDOM.render(<Record {...params} />, root),
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
  { path: "/settings", view: () => console.log("view settings") },
];
