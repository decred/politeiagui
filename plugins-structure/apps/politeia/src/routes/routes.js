import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import { records } from "@politeiagui/core/records";
import { ticketvoteConstants } from "@politeiagui/ticketvote";
import { commentsConstants } from "@politeiagui/comments";
import { Details, Home, New } from "../pages";
import { reducersArray as piReducers } from "../pi";
import { createAppRoute } from "./utils";
import { decodeProposalRecord } from "../components/Proposal/utils";

export const routes = [
  createAppRoute({
    path: "/",
    requiredPolicies: ["records", "comments", "ticketvote"],
    reducers: [
      ...ticketvoteConstants.reducersArray,
      ...commentsConstants.reducersArray,
    ],
    Component: Home,
  }),
  createAppRoute({
    path: "/record/new",
    reducers: [...piReducers],
    requiredPolicies: ["pi"],
    Component: New,
  }),
  createAppRoute({
    path: "/record/:token",
    requiredPolicies: ["pi", "comments", "ticketvote"],
    reducers: [
      ...ticketvoteConstants.reducersArray,
      ...commentsConstants.reducersArray,
      ...piReducers,
    ],
    Component: Details,
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
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
];
