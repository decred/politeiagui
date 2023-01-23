import { lazy } from "react";
import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import { serviceListeners } from "@politeiagui/core/records/services";

export default App.createRoute({
  path: "/record/:token/edit",
  // TODO: replace {id: "pi/new"} with piPolicy service listener
  setupServices: [{ id: "pi/new" }, serviceListeners.detailsOnLoad],
  title: "Edit Proposal",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "new_proposal_page" */ "./Edit"))
  ),
});
