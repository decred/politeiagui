import { store } from "@politeiagui/core";
import { records } from "@politeiagui/core/records";
import { DetailsRoute, HomeRoute, NewProposalRoute } from "../pages";
import { decodeProposalRecord } from "../pi/proposals/utils";
import { routeCleanup } from "../utils/routeCleanup";

export const routes = [
  HomeRoute,
  NewProposalRoute,
  DetailsRoute,
  { ...DetailsRoute, path: "/record/:token/comment/:commentid" },
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
    cleanup: routeCleanup,
  },
];
