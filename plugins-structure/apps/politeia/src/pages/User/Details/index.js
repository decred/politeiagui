import { lazy } from "react";
import App from "../../../app";
import { routeCleanup } from "../../../utils/routeCleanup";
import { createRouteView } from "../../../utils/createRouteView";

import { serviceListeners as draftsListeners } from "@politeiagui/core/records/drafts/services";
import { serviceListeners as authListeners } from "@politeiagui/core/user/auth/services";
import { serviceListeners as usersListeners } from "@politeiagui/core/user/users/services";
import { serviceListeners as paymentsListeners } from "@politeiagui/core/user/payments/services";
import { servicesSetupsByUserInventory } from "../../../pi/proposalsList/servicesSetups";
import { listenToUserInventoryFetch } from "../../../pi/proposalsList/listeners";

import overSome from "lodash/overSome";
import { isUserAdmin, isUserOwner, navigateToDetails } from "../utils";

import Details from "./Details";
import { userPayments } from "@politeiagui/core/user/payments";
import { router } from "@politeiagui/core/router";

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
  when: isUserOwner,
  otherwise: navigateToDetails,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Drafts")),
    "#user-router"
  ),
};

const userProposalsParams = {
  path: "/proposals",
  title: "Proposals",
  setupServices: servicesSetupsByUserInventory,
  listeners: [listenToUserInventoryFetch],
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
  when: isUserOwner,
  otherwise: navigateToDetails,
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
  setupServices: [
    paymentsListeners.fetchPaywallOnLoad,
    paymentsListeners.credits
      .listenTo({
        actionCreator: userPayments.fetchPaywall.fulfilled,
      })
      .customizeEffect((effect, _, { getState, dispatch }) => {
        const { params } = router.getCurrentLocation();
        if (isUserOwner(params, getState)) {
          return effect(getState(), dispatch);
        }
      }),
  ],
  when: overSome([isUserAdmin, isUserOwner]),
  otherwise: navigateToDetails,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_details_page" */ "./Credits")),
    "#user-router"
  ),
};

const user2faParams = {
  path: "/2fa",
  title: "2FA",
  when: isUserOwner,
  otherwise: navigateToDetails,
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
    // Public Routes (everyone)
    userAccountParams,
    userIdentityParams,
    userProposalsParams,
    // Owner Routes (user only)
    userDraftsParams,
    userPreferencesParams,
    user2faParams,
    // Private Routes (owner or admin)
    userCreditsParams,
  ],
  wrapperView: createRouteView(Details),
});

export default userRouter;
