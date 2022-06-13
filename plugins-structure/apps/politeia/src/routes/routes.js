import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import { records } from "@politeiagui/core/records";
import { Details, Home, New } from "../pages";
import { createAppRoute } from "./utils";
import { decodeProposalRecord } from "../components/Proposal/utils";

export const routes = [
  createAppRoute({
    path: "/",
    Component: Home,
  }),
  createAppRoute({
    path: "/record/new",
    Component: New,
  }),
  createAppRoute({
    path: "/record/:token",
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
