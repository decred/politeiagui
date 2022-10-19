import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import { router } from "@politeiagui/core/router";
import { navigation } from "@politeiagui/common-ui/services";

export function routeCleanup() {
  const location = router.getCurrentLocation();
  if (location) {
    store.dispatch(navigation.push(location));
  }

  return ReactDOM.unmountComponentAtNode(document.querySelector("#root"));
}
