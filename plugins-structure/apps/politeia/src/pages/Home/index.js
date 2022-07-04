import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import Home from "./Home";
import {
  initializeFetchNextBatchListener,
  initializeRecordsBatchFetchNextBatchListener,
  listeners,
} from "./listeners";

export default App.createRoute({
  path: "/",
  initialize: [
    {
      id: "ticketvote/inventory",
    },
    {
      id: "records/batch",
      listener: initializeRecordsBatchFetchNextBatchListener,
    },
    {
      id: "ticketvote/summaries",
      listener: initializeFetchNextBatchListener,
    },
    {
      id: "comments/counts",
      listener: initializeFetchNextBatchListener,
    },
  ],
  listeners,
  cleanup: routeCleanup,
  view: createRouteView(Home),
});
