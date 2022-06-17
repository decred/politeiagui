import ReactDOM from "react-dom";
import AllStatusPage from "../dev/pages/AllStatuses";

export const routes = [
  {
    path: "/",
    view: AllStatusPage,
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
];
