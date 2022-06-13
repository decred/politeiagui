import { appSetup } from "@politeiagui/core";
// Plugins
import TicketvotePlugin from "@politeiagui/ticketvote";
import UiPlugin from "@politeiagui/common-ui";
import CommentsPlugin from "@politeiagui/comments";
import PiPlugin from "./pi";
// App Routes
import { routes } from "./routes";

const pluginsProxyMap = {
  "/": [
    "/records/batch",
    "/ticketvote/inventory",
    "/ticketvote/summaries",
    "/comments/counts",
  ],
  "/record/new": ["/pi/new"],
  "/record/:id": [
    "/ticketvote/timestamps",
    "/ticketvote/summaries",
    "/comments/timestamps",
    "/comments/votes",
    "/pi/summaries",
  ],
};

const PoliteiaApp = appSetup({
  plugins: [TicketvotePlugin, UiPlugin, CommentsPlugin, PiPlugin],
  pluginsProxyMap,
  viewRoutes: routes,
});

export default PoliteiaApp;
