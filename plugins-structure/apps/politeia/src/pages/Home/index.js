import { lazy } from "react";
import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import { voteInventorySetupServices } from "../../pi/proposalsList/servicesSetup";
import { listenToVoteInventoryFetch } from "../../pi/proposalsList/listeners";

export default App.createRoute({
  path: "/",
  setupServices: voteInventorySetupServices,
  listeners: [listenToVoteInventoryFetch],
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "home_page" */ "./Home"))
  ),
});
