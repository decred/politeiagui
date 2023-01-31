import { appSetup } from "@politeiagui/core";
// Plugins
import TicketvotePlugin from "@politeiagui/ticketvote";
import UiPlugin from "@politeiagui/common-ui";
import CommentsPlugin from "@politeiagui/comments";
import PiPlugin from "./pi";
// Global app services
import { downloadServicesListeners } from "./pi/downloads/listeners";
import { serviceListeners as authListeners } from "@politeiagui/core/user/auth/services";
import { api } from "@politeiagui/core/api";

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
    // This listener will be executed when the user has an active session on the
    // server. The active session status is retrieved from api fetch fulfilled
    // action.
    authListeners.loadMe
      .listenTo({ actionCreator: api.fetch.fulfilled })
      .customizeEffect((effect, action, { getState, dispatch }) => {
        effect(getState(), dispatch, action.payload.api);
      }),
  ],
});

export default PoliteiaApp;
