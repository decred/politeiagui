import { lazy } from "react";
import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import { serviceListeners as detailsListeners } from "@politeiagui/core/records/services";
import { serviceListeners as policyListeners } from "../../pi/policy/services";

export default App.createRoute({
  path: "/record/:token/edit",
  setupServices: [policyListeners.fetch, detailsListeners.detailsOnLoad],
  title: "Edit Proposal",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "new_proposal_page" */ "./Edit"))
  ),
});
