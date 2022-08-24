import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import {
  fetchBillingStatusChangesListenerCreator,
  fetchCommentsTimestampsListenerCreator,
  fetchDetailsListenerCreator,
  fetchProposalSummaryListenerCreator,
  fetchRecordDetailsListenerCreator,
  fetchVoteSummaryListenerCreator,
  recordFetchDetailsListenerCreator,
} from "./listeners";
import Details from "./Details";

export default App.createRoute({
  path: "/record/:token",
  setupServices: [
    {
      id: "ticketvote/timestamps",
    },
    {
      id: "comments/timestamps",
      listenerCreator: fetchCommentsTimestampsListenerCreator,
    },
    {
      id: "records/details",
      listenerCreator: recordFetchDetailsListenerCreator,
    },
    {
      id: "ticketvote/summaries/single",
      listenerCreator: fetchDetailsListenerCreator,
    },
    {
      id: "comments",
      listenerCreator: fetchDetailsListenerCreator,
    },
    {
      id: "pi/summaries/single",
      listenerCreator: fetchDetailsListenerCreator,
    },
    {
      id: "pi/billingStatusChanges/single",
      listenerCreator: fetchProposalSummaryListenerCreator,
    },
    // Proposal status changes services
    {
      id: "pi/proposals/voteStatusChanges",
      listenerCreator: fetchVoteSummaryListenerCreator,
    },
    {
      id: "pi/proposals/recordStatusChanges",
      listenerCreator: fetchRecordDetailsListenerCreator,
    },
    {
      id: "pi/proposals/billingStatusChanges",
      listenerCreator: fetchBillingStatusChangesListenerCreator,
    },
  ],
  cleanup: routeCleanup,
  view: createRouteView(Details),
});
