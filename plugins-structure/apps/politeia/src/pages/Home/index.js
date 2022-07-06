import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import Home from "./Home";
import {
  fetchNextBatchListener,
  listeners,
  recordsFetchNextBatchListener,
} from "./listeners";

export default App.createRoute({
  path: "/",
  setupServices: [
    {
      id: "ticketvote/inventory",
    },
    {
      id: "records/batch",
      listener: recordsFetchNextBatchListener,
    },
    {
      id: "ticketvote/summaries",
      listener: fetchNextBatchListener,
    },
    {
      id: "comments/count",
      listener: fetchNextBatchListener,
    },
  ],
  listeners,
  cleanup: routeCleanup,
  view: createRouteView(Home),
});
