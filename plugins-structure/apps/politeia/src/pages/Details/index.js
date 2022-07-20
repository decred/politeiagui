import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import {
  fetchDetailsListenerCreator,
  recordFetchDetailsListenerCreator,
} from "./listeners";
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
      listenerCreator: recordFetchDetailsListenerCreator,
    },
    {
      id: "ticketvote/summaries/single",
      listenerCreator: fetchDetailsListenerCreator,
    },
    {
      id: "comments",
      listenerCreator: fetchDetailsListenerCreator,
    },
    {
      id: "pi/summaries/single",
      listenerCreator: fetchDetailsListenerCreator,
    },
  ],
  cleanup: routeCleanup,
  view: createRouteView(Details),
});
