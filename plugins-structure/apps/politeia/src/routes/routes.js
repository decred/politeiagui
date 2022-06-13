import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import { records } from "@politeiagui/core/records";
import { Details, Home } from "../pages";
import homeReducer from "../pages/Home/homeSlice";
import detailsReducer from "../pages/Details/detailsSlice";
import { createAppRoute } from "./utils";
import { decodeProposalRecord } from "../components/Proposal/utils";

const homeReducerObj = {
  key: "home",
  reducer: homeReducer,
};

const detailsReducerObj = {
  key: "details",
  reducer: detailsReducer,
};

export const routes = [
  createAppRoute({
    path: "/",
    reducers: [homeReducerObj],
    Component: Home,
  }),
  createAppRoute({
    path: "/record/:token",
    reducers: [detailsReducerObj],
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
