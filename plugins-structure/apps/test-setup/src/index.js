import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { appSetup, store } from "@politeiagui/core";
// Plugins
import TicketvotePlugin from "@politeiagui/ticketvote";
// Test-plugins
import { LogPlugin } from "./plugins/log";
// Pages
import { Details, Home } from "./pages";

const root = document.querySelector("#root");

const Header = () => (
  <nav>
    <a data-link href="/">
      Home
    </a>
  </nav>
);

const viewRoutes = [
  {
    path: "/",
    view: async () => {
      return ReactDOM.render(
        <Provider store={store}>
          <Header />
          <Home />
        </Provider>,
        root
      );
    },
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
  {
    path: "/app",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <Home />
        </Provider>,
        root
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
  {
    path: "/record/:id",
    view: (params) =>
      ReactDOM.render(
        <Provider store={store}>
          <Header />
          <Details token={params.id} />
        </Provider>,
        root
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
];

async function TestApp() {
  // By default, plugin will be configured for its own routes. In order to
  // force a diffrerent behavior from plugin's default, you can use a proxy to
  // redirect the setup to an app route. For example: we can setup the
  // ticketvote inventory on home page by proxying the "/ticketvote/inventory"
  // route to "/", and we should have it all ready to play on "/"
  const pluginsProxyMap = {
    "/": ["/ticketvote/inventory", "/ticketvote/summaries"],
    "/record/:id": ["/ticketvote/timestamps", "/ticketvote/summaries"],
    "/app": ["/log/store", "/ticketvote/inventory", "/ticketvote/summaries"],
  };

  const App = await appSetup({
    // Log plugin is a test plugin, defined locally on the test-app shell
    plugins: [TicketvotePlugin, LogPlugin],
    pluginsProxyMap,
    viewRoutes,
  });

  App.init();
}

TestApp();
