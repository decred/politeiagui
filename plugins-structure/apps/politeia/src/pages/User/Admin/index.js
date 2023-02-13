import { lazy } from "react";
import App from "../../../app";
import { routeCleanup } from "../../../utils/routeCleanup";
import { createRouteView } from "../../../utils/createRouteView";
import { servicesSetupsByRecordsInventory } from "../../../pi/proposalsList/servicesSetups";
import { listenToRecordsInventoryFetch } from "../../../pi/proposalsList/listeners";
import { isUserAdmin } from "../utils";

const adminProposalsRoute = {
  path: "/records",
  cleanup: routeCleanup,
  title: "Admin Unvetted Proposals",
  setupServices: servicesSetupsByRecordsInventory,
  listeners: [listenToRecordsInventoryFetch],
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "admin_proposals_page" */ "./Proposals")
    )
  ),
};

const adminUserSearchRoute = {
  path: "/search",
  title: "Search for Users",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "admin_user_search_page" */ "./UserSearch")
    )
  ),
};

const adminRouter = App.createSubRouter({
  path: "/admin",
  title: "Admin",
  when: isUserAdmin,
  otherwise: (_, go) => go("/"),
  cleanup: routeCleanup,
  subRoutes: [adminProposalsRoute, adminUserSearchRoute],
});

export default adminRouter;
