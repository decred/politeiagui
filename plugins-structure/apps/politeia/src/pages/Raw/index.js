import { lazy } from "react";
import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import { serviceListeners } from "@politeiagui/core/records/services";

export default App.createRoute({
  path: "/record/:token/raw",
  setupServices: [serviceListeners.detailsOnLoad],
  title: "Raw Proposal",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "new_proposal_page" */ "./Raw"))
  ),
});
