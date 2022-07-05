import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import {
  initializeFetchProposalDetailsListener,
  initializeRecordDetailsFetchProposalDetailsListener,
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
      listener: initializeFetchProposalDetailsListener,
    },
    {
      id: "comments/votes",
      listener: initializeFetchProposalDetailsListener,
    },
    {
      id: "pi/summaries",
      listener: initializeFetchProposalDetailsListener,
    },
  ],
  cleanup: routeCleanup,
  view: createRouteView(Details),
});
