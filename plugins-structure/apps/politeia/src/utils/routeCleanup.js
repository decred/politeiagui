import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import { router } from "@politeiagui/core/router";
import { navigation } from "@politeiagui/core/globalServices";

export function routeCleanup() {
  const location = router.getCurrentLocation();
  if (location) {
    store.dispatch(navigation.push(location));
  }

  return ReactDOM.unmountComponentAtNode(document.querySelector("#root"));
}
