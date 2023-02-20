import { appSetup } from "@politeiagui/core";
// Plugins
import TicketvotePlugin from "@politeiagui/ticketvote";
import UiPlugin from "@politeiagui/common-ui";
import CommentsPlugin from "@politeiagui/comments";
import PiPlugin from "./pi";
// Global app services
import { downloadServicesListeners } from "./pi/downloads/listeners";
import { serviceListeners as authListeners } from "@politeiagui/core/user/auth/services";
import { serviceListeners as apiListeners } from "@politeiagui/core/api/services";
// Slices
import { userAuth } from "@politeiagui/core/user/auth";

/**
 * This listener will be executed when the user has an active session on the
 * server. The active session status is retrieved from api fetch fulfilled
 * action.
 */
const loadActiveSession = authListeners.meOnLoad;

/**
 * This listener will be executed when the user logs out. The logout action
 * is dispatched by the userAuth slice. The listener will refresh the api
 * client to clear the session cookie and renew the CSRF token.
 */
const refreshApiOnLogout = apiListeners.refreshApi.listenTo({
  actionCreator: userAuth.logout.fulfilled,
});

const PoliteiaApp = appSetup({
  plugins: [TicketvotePlugin, UiPlugin, CommentsPlugin, PiPlugin],
  config: {
    name: "Politeia - Decred's Proposals System",
    title: "Politeia",
    description:
      "Politeia is the proposal system that is used to request funding from Decred's network treasury. The Decred stakeholders decide how treasury funds are allocated.",
  },
  setupServices: [
    ...downloadServicesListeners,
    loadActiveSession,
    refreshApiOnLogout,
  ],
});

export default PoliteiaApp;
