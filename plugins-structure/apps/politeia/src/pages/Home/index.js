import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import Home from "./Home";
import {
  fetchNextBatchListenerCreator,
  listeners,
  recordsFetchNextBatchListenerCreator,
} from "./listeners";

export default App.createRoute({
  path: "/",
  setupServices: [
    {
      id: "ticketvote/inventory",
    },
    {
      id: "records/batch",
      listenerCreator: recordsFetchNextBatchListenerCreator,
    },
    {
      id: "ticketvote/summaries",
      listenerCreator: fetchNextBatchListenerCreator,
    },
    {
      id: "comments/count",
      listenerCreator: fetchNextBatchListenerCreator,
    },
  ],
  listeners,
  cleanup: routeCleanup,
  view: createRouteView(Home),
});
