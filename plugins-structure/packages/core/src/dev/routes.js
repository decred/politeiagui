import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Records from "./pages/Records";
import Record from "./pages/Record";
import { store } from "../storeSetup";
import App from "./app";
import { fetchNextBatchListenerCreator } from "./listeners";

const cleanup = () =>
  ReactDOM.unmountComponentAtNode(document.querySelector("#root"));

export const routes = [
  App.createRoute({
    path: "/",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <Records />
        </Provider>,
        document.querySelector("#root")
      ),
    cleanup,
    setupServices: [
      { id: "records/batch", listenerCreator: fetchNextBatchListenerCreator },
      { id: "records/inventory" },
    ],
  }),
  {
    path: "/record/:id",
    title: "Record",
    view: (params) =>
      ReactDOM.render(<Record {...params} />, document.querySelector("#root")),
    cleanup,
  },
  { path: "/settings", view: () => console.log("view settings") },
];
