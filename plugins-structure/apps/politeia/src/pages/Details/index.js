import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import {
  fetchBillingStatusChangesListenerCreator,
  fetchDetailsListenerCreator,
  fetchProposalSummaryListenerCreator,
  fetchRecordDetailsListenerCreator,
  fetchRfpDetailsListenerCreator,
  fetchRfpLinkedProposalListenerCreator,
  fetchRfpSubmissionsListenerCreator,
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
    // RFP Proposals Services
    {
      id: "ticketvote/submissions",
      listenerCreator: fetchRfpDetailsListenerCreator,
    },
    {
      id: "records/batch/all",
      listenerCreator: fetchRfpSubmissionsListenerCreator,
    },
    {
      id: "ticketvote/summaries/all",
      listenerCreator: fetchRfpSubmissionsListenerCreator,
    },
    {
      id: "pi/summaries/all",
      listenerCreator: fetchRfpSubmissionsListenerCreator,
    },
    {
      id: "comments/count/all",
      listenerCreator: fetchRfpSubmissionsListenerCreator,
    },
    // RFP Submissions Services
    {
      id: "records/batch",
      listenerCreator: fetchRfpLinkedProposalListenerCreator,
    },
  ],
  cleanup: routeCleanup,
  view: createRouteView(Details),
});
