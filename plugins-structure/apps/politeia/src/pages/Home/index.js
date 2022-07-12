import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import Home from "./Home";
import {
  fetchNextBatchCountListenerCreator,
  fetchNextBatchRecordsListenerCreator,
  fetchNextBatchSummariesListenerCreator,
  listeners,
} from "./listeners";

export default App.createRoute({
  path: "/",
  setupServices: [
    {
      id: "ticketvote/inventory",
    },
    {
      id: "records/batch",
      listenerCreator: fetchNextBatchRecordsListenerCreator,
    },
    {
      id: "ticketvote/summaries",
      listenerCreator: fetchNextBatchSummariesListenerCreator,
    },
    {
      id: "comments/count",
      listenerCreator: fetchNextBatchCountListenerCreator,
    },
  ],
  listeners,
  cleanup: routeCleanup,
  view: createRouteView(Home),
});
