// @politeiagui/core is available for the plugin usage
import ReactDOM from "react-dom";
// Dev Pages
import AllStatusesPage from "../dev/pages/AllStatuses";

// Routes for ticketvote plugin
export const routes = [
  {
    path: "/ticketvote",
    view: AllStatusesPage,
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
];
