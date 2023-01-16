import { lazy } from "react";
import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";

import { serviceListeners } from "@politeiagui/core/records/drafts/services";

export default App.createRoute({
  path: "/record/new",
  setupServices: [{ id: "pi/new" }, serviceListeners.load],
  title: "New Proposal",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "new_proposal_page" */ "./New"))
  ),
});
