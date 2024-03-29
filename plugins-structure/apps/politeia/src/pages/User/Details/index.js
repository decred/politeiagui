import { lazy } from "react";
import App from "../../../app";
import { routeCleanup } from "../../../utils/routeCleanup";
import { createRouteView } from "../../../utils/createRouteView";
import { serviceListeners as draftsListeners } from "@politeiagui/core/records/drafts/services";
import { servicesSetupsByRecordsInventory } from "../../../pi/proposalsList/servicesSetups";
import { listenToRecordsInventoryFetch } from "../../../pi/proposalsList/listeners";

const baseRoute = App.createRoute({
  path: "/user/:userid",
  title: "User Details",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Identity"))
  ),
});

const userProposalsRoute = App.createRoute({
  path: "/user/:userid/proposals",
  title: "User Proposals",
  cleanup: routeCleanup,
  // TODO: Use user proposals inventory & listeners
  setupServices: servicesSetupsByRecordsInventory,
  listeners: [listenToRecordsInventoryFetch],
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "user_details_page" */ "./Proposals")
    )
  ),
});

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
  setupServices: [draftsListeners.load],
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Drafts"))
  ),
});

const user2faRoute = App.createRoute({
  path: "/user/:userid/2fa",
  title: "User 2FA",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./TwoFA"))
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
