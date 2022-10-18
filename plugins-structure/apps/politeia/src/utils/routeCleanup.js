import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import {
  findMatch,
  getParams,
  getURLSearchParams,
  router,
} from "@politeiagui/core/router";
import { navigation } from "@politeiagui/common-ui/services";

export function routeCleanup() {
  // push router match to our ui navigation service.
  const match = findMatch(router.getRoutes(), window.location.pathname);
  if (match) {
    store.dispatch(
      navigation.push({
        match: match.result[0],
        path: match.route.path,
        params: getParams(match),
        search: getURLSearchParams(),
        href: window.location.href,
      })
    );
  }
  return ReactDOM.unmountComponentAtNode(document.querySelector("#root"));
}
