import { lazy } from "react";
import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import { servicesSetupsByVoteInventory } from "../../pi/proposalsList/servicesSetups";
import { listenToVoteInventoryFetch } from "../../pi/proposalsList/listeners";

export default App.createRoute({
  path: "/",
  setupServices: servicesSetupsByVoteInventory,
  listeners: [listenToVoteInventoryFetch],
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "home_page" */ "./Home"))
  ),
});
