import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { appSetup, store } from "@politeiagui/core";
// Plugins
import TicketvotePlugin from "@politeiagui/ticketvote";
import UiPlugin from "@politeiagui/common-ui";
import CommentsPlugin from "@politeiagui/comments";
import PiPlugin from "./pi";
// App Routes
import { routes } from "./routes";
// Theme
import { UiTheme } from "@politeiagui/common-ui/layout";
// Components
import { Header } from "./components";

async function PoliteiaApp() {
  const pluginsProxyMap = {
    "/": [
      "/records/batch",
      "/ticketvote/inventory",
      "/ticketvote/summaries",
      "/comments/counts",
    ],
    "/record/:id": [
      "/ticketvote/timestamps",
      "/ticketvote/summaries",
      "/comments/timestamps",
      "/comments/votes",
      "/pi/summaries",
    ],
  };

  const App = await appSetup({
    plugins: [TicketvotePlugin, UiPlugin, CommentsPlugin, PiPlugin],
    pluginsProxyMap,
    viewRoutes: routes,
  });

  App.init();
}

PoliteiaApp();

ReactDOM.render(
  <Provider store={store}>
    {/* TODO: Use header after connecting theme/ui plugin */}
    {/* <Header /> */}
    <div id="root"></div>
  </Provider>,
  document.querySelector("#app-root")
);
