import { lazy } from "react";
import App from "../../../app";
import { routeCleanup } from "../../../utils/routeCleanup";
import { createRouteView } from "../../../utils/createRouteView";
import { router } from "@politeiagui/core/router";

import { voteInventorySetupServices } from "../../../pi/proposalsList/servicesSetup";
import { listenToVoteInventoryFetch } from "../../../pi/proposalsList/listeners";

const baseRoute = App.createRoute({
  path: "/user/:userid",
  cleanup: routeCleanup,
  view: ({ userid }) => {
    router.navigateTo(`/user/${userid}/proposals`);
  },
});

const userProposalsRoute = App.createRoute({
  path: "/user/:userid/proposals",
  title: "User Proposals",
  cleanup: routeCleanup,
  // TODO: Use user proposals inventory & listeners
  setupServices: voteInventorySetupServices,
  listeners: [listenToVoteInventoryFetch],
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "user_details_page" */ "./Proposals")
    )
  ),
});

const userDetailsRoutes = [baseRoute, userProposalsRoute];

export default userDetailsRoutes;
