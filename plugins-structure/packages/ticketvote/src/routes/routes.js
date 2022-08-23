import ReactDOM from "react-dom";

export const routes = [
  {
    path: "/",
    // view: AllStatusPage,
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
];
