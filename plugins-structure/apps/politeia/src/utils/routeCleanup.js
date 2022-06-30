import ReactDOM from "react-dom";

export function routeCleanup() {
  return ReactDOM.unmountComponentAtNode(document.querySelector("#root"));
}
