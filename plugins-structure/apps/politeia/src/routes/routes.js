import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";
import { ModalProvider } from "@politeiagui/common-ui";
import { records } from "@politeiagui/core/records";
import { UiTheme } from "@politeiagui/common-ui/layout";

import { Details, Home, New } from "../pages";
import { decodeProposalRecord } from "../components/Proposal/utils";
import App from "../app";

function cleanup() {
  return ReactDOM.unmountComponentAtNode(document.querySelector("#root"));
}

function routeView(Component) {
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

export const routes = [
  App.createRoute({
    path: "/",
    initializerIds: [
      "records/batch",
      "ticketvote/inventory",
      "ticketvote/summaries",
      "comments/counts",
    ],
    cleanup,
    view: routeView(Home),
  }),
  App.createRoute({
    path: "/record/new",
    initializerIds: ["pi/new"],
    cleanup,
    view: routeView(New),
  }),
  App.createRoute({
    path: "/record/:token",
    initializerIds: [
      "ticketvote/timestamps",
      "ticketvote/summaries",
      "comments/timestamps",
      "comments/votes",
      "pi/summaries",
    ],
    cleanup,
    view: routeView(Details),
  }),
  {
    path: "/record/:token/raw",
    view: async ({ token }) => {
      const { payload: recordDetails } = await store.dispatch(
        records.fetchDetails({ token })
      );
      const proposalDetails = decodeProposalRecord(recordDetails);
      return (document.querySelector(
        "#root"
      ).innerHTML = `<pre style="white-space: pre-line;margin: 1rem">${proposalDetails.body}</pre>`);
    },
    cleanup,
  },
];
