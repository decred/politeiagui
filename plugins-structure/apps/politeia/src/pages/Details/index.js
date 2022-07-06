import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import { fetchDetailsListener, recordFetchDetailsListener } from "./listeners";
import Details from "./Details";

export default App.createRoute({
  path: "/record/:token",
  setupServices: [
    {
      id: "ticketvote/timestamps",
    },
    {
      id: "comments/timestamps",
    },
    {
      id: "records/details",
      listener: recordFetchDetailsListener,
    },
    {
      id: "ticketvote/summaries/single",
      listener: fetchDetailsListener,
    },
    {
      id: "comments",
      listener: fetchDetailsListener,
    },
    {
      id: "pi/summaries",
      listener: fetchDetailsListener,
    },
  ],
  cleanup: routeCleanup,
  view: createRouteView(Details),
});
