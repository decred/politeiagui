import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import { listeners } from "./listeners";
import Details from "./Details";

export default App.createRoute({
  path: "/record/:token",
  initializerIds: [
    "ticketvote/timestamps",
    "ticketvote/summaries",
    "comments/timestamps",
    "comments/votes",
    "pi/summaries",
  ],
  listeners,
  cleanup: routeCleanup,
  view: createRouteView(Details),
});
