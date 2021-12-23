import ReactDOM from "react-dom";
import RecordCommentsPage from "../dev/pages/RecordComments";

export const routes = [
  {
    path: "/comments/:token",
    view: RecordCommentsPage,
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
];
