// @politeiagui/core is available for the plugin usage
import ReactDOM from "react-dom";
// Dev Pages
import UnderReviewPage from "../dev/pages/UnderReview";
import AllStatusesPage from "../dev/pages/AllStatuses";
import DetailsPage from "../dev/pages/Details";

// Routes for ticketvote plugin
export const routes = [
  {
    path: "/ticketvote",
    view: AllStatusesPage,
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
  {
    path: "/under-review",
    view: UnderReviewPage,
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
  {
    path: "/ticketvote/:token",
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
    view: DetailsPage,
  },
];
