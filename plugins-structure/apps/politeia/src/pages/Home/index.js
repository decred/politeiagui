import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import Home from "./Home";
import {
  fetchNextBatchBillingStatusesListenerCreator,
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
      id: "pi/summaries",
      listenerCreator: fetchNextBatchSummariesListenerCreator,
    },
    {
      id: "pi/billingStatusChanges",
      listenerCreator: fetchNextBatchBillingStatusesListenerCreator,
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
