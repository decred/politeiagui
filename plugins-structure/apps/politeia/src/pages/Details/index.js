import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
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
  cleanup: routeCleanup,
  view: createRouteView(Details),
});
