import { lazy } from "react";
import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";

import { serviceListeners as draftsListeners } from "@politeiagui/core/records/drafts/services";
import { serviceListeners as policyListeners } from "../../pi/policy/services";

export default App.createRoute({
  path: "/record/new",
  setupServices: [policyListeners.fetch, draftsListeners.load],
  title: "New Proposal",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "new_proposal_page" */ "./New"))
  ),
});
