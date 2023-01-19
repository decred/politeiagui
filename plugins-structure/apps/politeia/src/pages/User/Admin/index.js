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

const routes = [adminProposalsRoute];

export default routes;
