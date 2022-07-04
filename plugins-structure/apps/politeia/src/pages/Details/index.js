import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import {
  initializeRecordDetailsFetchProposalDetailsListener,
  initializefetchProposalDetailsListener,
} from "./listeners";
import Details from "./Details";

export default App.createRoute({
  path: "/record/:token",
  initialize: [
    {
      id: "ticketvote/timestamps",
    },
    {
      id: "comments/timestamps",
    },
    {
      id: "records/details",
      listener: initializeRecordDetailsFetchProposalDetailsListener,
    },
    {
      id: "ticketvote/summaries/single",
      listener: initializefetchProposalDetailsListener,
    },
    {
      id: "comments/votes",
      listener: initializefetchProposalDetailsListener,
    },
    {
      id: "pi/summaries",
      listener: initializefetchProposalDetailsListener,
    },
  ],
  cleanup: routeCleanup,
  view: createRouteView(Details),
});
