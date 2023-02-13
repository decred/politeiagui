import { lazy } from "react";
import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";

import { serviceListeners as draftsListeners } from "@politeiagui/core/records/drafts/services";
import { serviceListeners as policyListeners } from "../../pi/policy/services";
import { userAuth } from "@politeiagui/core/user/auth";

export default App.createRoute({
  path: "/record/new",
  setupServices: [policyListeners.fetch, draftsListeners.load],
  title: "New Proposal",
  when: (_, getState) => userAuth.selectCurrent(getState()) !== null,
  otherwise: (_, go) => go("/user/login"),
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "new_proposal_page" */ "./New"))
  ),
});
