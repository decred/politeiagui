import ReactDOM from "react-dom";
import { appSetup } from "@politeiagui/core";
import TicketvotePlugin from "../";
import AllStatusPage from "./pages/AllStatuses";

const viewRoutes = [
  {
    path: "/",
    view: AllStatusPage,
    cleanup: ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
];

async function initializeApp() {
  const App = await appSetup({
    plugins: [TicketvotePlugin],
    viewRoutes,
    pluginsProxy: {
      "/": ["/ticketvote/inventory", "/ticketvote/summaries"],
    },
  });
  App.init();
}

initializeApp();
