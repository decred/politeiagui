import { lazy } from "react";
import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";

import {
  commentsCountsRfpSubmissionsListener,
  commentsListener,
  proposalBillingStatusChangesListener,
  proposalSummaryListener,
  proposalsSummariesRfpSubmissionsListener,
  recordDetailsListener,
  recordRfpProposalListener,
  recordsRfpSubmissionsListener,
  voteSubmissionsListener,
  voteSummariesRfpSubmissionsListener,
  voteSummaryListener,
} from "./servicesListeners";
import {
  billingStatusChangesListener,
  recordsStatusChangesListener,
  voteStatusChangesListener,
} from "../../pi/proposals/servicesListeners";

export default App.createRoute({
  path: "/record/:token",
  setupServices: [
    commentsCountsRfpSubmissionsListener,
    commentsListener,
    proposalBillingStatusChangesListener,
    proposalSummaryListener,
    proposalsSummariesRfpSubmissionsListener,
    recordDetailsListener,
    recordRfpProposalListener,
    recordsRfpSubmissionsListener,
    voteSubmissionsListener,
    voteSummariesRfpSubmissionsListener,
    voteSummaryListener,
    // Proposal status changes listeners
    billingStatusChangesListener,
    recordsStatusChangesListener,
    voteStatusChangesListener,
  ],
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "details_page" */ "./Details"))
  ),
});
