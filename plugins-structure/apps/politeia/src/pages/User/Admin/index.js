import { lazy } from "react";
import App from "../../../app";
import { routeCleanup } from "../../../utils/routeCleanup";
import { createRouteView } from "../../../utils/createRouteView";
import { servicesSetupsByRecordsInventory } from "../../../pi/proposalsList/servicesSetups";
import { listenToRecordsInventoryFetch } from "../../../pi/proposalsList/listeners";

const adminProposalsRoute = App.createRoute({
  path: "/admin/records",
  cleanup: routeCleanup,
  setupServices: servicesSetupsByRecordsInventory,
  listeners: [listenToRecordsInventoryFetch],
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "admin_proposals_page" */ "./Proposals")
    )
  ),
});

const adminUserSearchRoute = App.createRoute({
  path: "/admin/search",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "admin_user_search_page" */ "./UserSearch")
    )
  ),
});

const routes = [adminProposalsRoute, adminUserSearchRoute];

export default routes;
