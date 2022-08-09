import ReactDOM from "react-dom";
import RecordCommentsPage from "./pages/RecordComments";

export const routes = [
  {
    path: "/comments",
    view: RecordCommentsPage,
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root"))
  },
  {
    path: "/comments/:token",
    view: RecordCommentsPage,
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root"))
  },
  {
    path: "/comments/:token/:userid",
    view: RecordCommentsPage,
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root"))
  }
];
