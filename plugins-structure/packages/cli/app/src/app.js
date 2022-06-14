import React from "react";
import ReactDOM from "react-dom";
import { appSetup } from "@politeiagui/core";
import { Provider } from "react-redux";
import { store } from "@politeiagui/core";

const root = document.querySelector("#root");

const AppPage = () => {
  return <h1>__APP_NAME__ PAGE</h1>;
};

const Home = () => {
  return <h1>__APP_NAME__ HOME PAGE</h1>;
};

const routes = [
  {
    path: "/__APP_NAME__",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <AppPage />
        </Provider>,
        root
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
  {
    path: "/",
    view: () =>
      ReactDOM.render(
        <Provider store={store}>
          <Home />
        </Provider>,
        root
      ),
    cleanup: () => ReactDOM.unmountComponentAtNode(root),
  },
];

const App = appSetup({
  plugins: [
    /* Connect your plugins here */
  ],
  pluginsProxyMap: {
    /* You can setup a proxy to redirect plugins routes to application routes */
  },
  viewRoutes: routes,
});

export default App;
