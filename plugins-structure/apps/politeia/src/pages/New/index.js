import App from "../../app";
import { routeCleanup } from "../../utils/routeCleanup";
import { createRouteView } from "../../utils/createRouteView";
import New from "./New";

export default App.createRoute({
  path: "/record/new",
  setupServices: ["pi/new"],
  cleanup: routeCleanup,
  view: createRouteView(New),
});
