import { lazy } from "react";
import App from "../../../app";
import { routeCleanup } from "../../../utils/routeCleanup";
import { createRouteView } from "../../../utils/createRouteView";

import { serviceListeners as draftsListeners } from "@politeiagui/core/records/drafts/services";
import { serviceListeners as authListeners } from "@politeiagui/core/user/auth/services";
import { serviceListeners as usersListeners } from "@politeiagui/core/user/users/services";
import { servicesSetupsByRecordsInventory } from "../../../pi/proposalsList/servicesSetups";
import { listenToRecordsInventoryFetch } from "../../../pi/proposalsList/listeners";

import Details from "./Details";

const userIdentityParams = {
  path: "/identity",
  title: "Identity",
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "user_details_page" */ "./Identity")
    ),
    "#user-router"
  ),
};

const userDraftsParams = {
  path: "/drafts",
  title: "Drafts",
  setupServices: [draftsListeners.load],
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Drafts")),
    "#user-router"
  ),
};

const userProposalsParams = {
  path: "/proposals",
  title: "Proposals",
  // TODO: Use user proposals inventory & listeners
  setupServices: servicesSetupsByRecordsInventory,
  listeners: [listenToRecordsInventoryFetch],
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "user_details_page" */ "./Proposals")
    ),
    "#user-router"
  ),
};

const userAccountParams = {
  path: "/account",
  title: "Account",
  setupServices: [authListeners.userPolicyOnLoad],
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Account")),
    "#user-router"
  ),
};

const userPreferencesParams = {
  path: "/preferences",
  title: "Preferences",
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "user_details_page" */ "./Preferences")
    ),
    "#user-router"
  ),
};

const userCreditsParams = {
  path: "/credits",
  title: "Credits",
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Credits")),
    "#user-router"
  ),
};

const user2faParams = {
  path: "/2fa",
  title: "2FA",
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./TwoFA")),
    "#user-router"
  ),
};

const userRouter = App.createSubRouter({
  path: "/user/:userid",
  title: "User",
  cleanup: routeCleanup,
  setupServices: [usersListeners.fetchDetailsOnLoad],
  defaultPath: "/user/:userid/identity",
  subRoutes: [
    userAccountParams,
    userCreditsParams,
    userDraftsParams,
    userIdentityParams,
    userPreferencesParams,
    userProposalsParams,
    user2faParams,
  ],
  wrapperView: createRouteView(Details),
});

export default userRouter;
