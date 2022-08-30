import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import Home from "./Home";
import {
  fetchBillingStatusChangesListenerCreator,
  fetchNextBatchBillingStatusesListenerCreator,
  fetchNextBatchCountListenerCreator,
  fetchNextBatchRecordsListenerCreator,
  fetchNextBatchSummariesListenerCreator,
  fetchRecordsListenerCreator,
  fetchRecordsRfpSubmissionsListenerCreator,
  fetchVoteSummariesListenerCreator,
  listeners,
} from "./listeners";

export default App.createRoute({
  path: "/",
  setupServices: [
    {
      id: "ticketvote/inventory",
    },
    {
      id: "records/batch",
      listenerCreator: fetchNextBatchRecordsListenerCreator,
    },
    {
      id: "ticketvote/summaries/batch",
      listenerCreator: fetchNextBatchSummariesListenerCreator,
    },
    {
      id: "pi/summaries/batch",
      listenerCreator: fetchNextBatchSummariesListenerCreator,
    },
    {
      id: "pi/billingStatusChanges",
      listenerCreator: fetchNextBatchBillingStatusesListenerCreator,
    },
    {
      id: "comments/count",
      listenerCreator: fetchNextBatchCountListenerCreator,
    },
    // Proposals Status changes
    {
      id: "pi/proposals/voteStatusChanges",
      listenerCreator: fetchVoteSummariesListenerCreator,
    },
    {
      id: "pi/proposals/recordStatusChanges",
      listenerCreator: fetchRecordsListenerCreator,
    },
    {
      id: "pi/proposals/billingStatusChanges",
      listenerCreator: fetchBillingStatusChangesListenerCreator,
    },
    // Rfp Sumbissions
    {
      id: "records/batch/all",
      listenerCreator: fetchRecordsRfpSubmissionsListenerCreator,
    },
  ],
  listeners,
  cleanup: routeCleanup,
  view: createRouteView(Home),
});
