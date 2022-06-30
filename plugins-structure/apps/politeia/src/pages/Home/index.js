import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import Home from "./Home";

export default App.createRoute({
  path: "/",
  initializerIds: [
    "records/batch",
    "ticketvote/inventory",
    "ticketvote/summaries",
    "comments/counts",
  ],
  cleanup: routeCleanup,
  view: createRouteView(Home),
});
