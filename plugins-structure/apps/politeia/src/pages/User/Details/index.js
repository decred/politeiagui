import { lazy } from "react";
import App from "../../../app";
import { routeCleanup } from "../../../utils/routeCleanup";
import { createRouteView } from "../../../utils/createRouteView";
import { router } from "@politeiagui/core/router";

import { recordsInventorySetupServices } from "../../../pi/proposalsList/servicesSetup";
import { listenToRecordsInventoryFetch } from "../../../pi/proposalsList/listeners";

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
  setupServices: recordsInventorySetupServices,
  listeners: [listenToRecordsInventoryFetch],
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "user_details_page" */ "./Proposals")
    )
  ),
});

// TODO: Implement routes views
const userIdentityRoute = App.createRoute({
  path: "/user/:userid/identity",
  title: "User Identity",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Identity"))
  ),
});
const userAccountRoute = App.createRoute({
  path: "/user/:userid/account",
  title: "User Account",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Account"))
  ),
});
const userPreferencesRoute = App.createRoute({
  path: "/user/:userid/preferences",
  title: "User Preferences",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "user_details_page" */ "./Preferences")
    )
  ),
});
const userCreditsRoute = App.createRoute({
  path: "/user/:userid/credits",
  title: "User Credits",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Credits"))
  ),
});
const userDraftsRoute = App.createRoute({
  path: "/user/:userid/drafts",
  title: "User Drafts",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Details"))
  ),
});
const user2faRoute = App.createRoute({
  path: "/user/:userid/2fa",
  title: "User 2FA",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Details"))
  ),
});

const userDetailsRoutes = [
  baseRoute,
  userProposalsRoute,
  userIdentityRoute,
  userAccountRoute,
  userPreferencesRoute,
  userCreditsRoute,
  userDraftsRoute,
  user2faRoute,
];

export default userDetailsRoutes;
