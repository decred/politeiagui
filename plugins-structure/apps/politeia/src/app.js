import { appSetup } from "@politeiagui/core";
// Plugins
import TicketvotePlugin from "@politeiagui/ticketvote";
import UiPlugin from "@politeiagui/common-ui";
import CommentsPlugin from "@politeiagui/comments";
import PiPlugin from "./pi";
// Global app services
import { downloadServicesSetup } from "./pi/downloads/listeners";

const PoliteiaApp = appSetup({
  plugins: [TicketvotePlugin, UiPlugin, CommentsPlugin, PiPlugin],
  config: {
    name: "Politeia - Decred's Proposals System",
    description:
      "Politeia is the proposal system that is used to request funding from Decred's network treasury. The Decred stakeholders decide how treasury funds are allocated.",
  },
  setupServices: [...downloadServicesSetup],
});

export default PoliteiaApp;
