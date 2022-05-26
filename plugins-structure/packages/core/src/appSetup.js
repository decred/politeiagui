import { connectReducers, store, validatePlugin } from "./";
import { api } from "./api";
import { findMatch, pluginsRouter, router } from "./router";

function mergeRoutes(routes, targetRoutes) {
  let mergedRoutes = routes;
  for (const route of targetRoutes) {
    if (findMatch(mergedRoutes, route.path)) {
      console.warn(
        `Conflicting background route path on "${route.path}". Pay attention`
      );
    }
    mergedRoutes = [...mergedRoutes, route];
  }
  return mergedRoutes;
}

async function popStateHandler(e) {
  const targetUrl = e.target.window.location.pathname;
  await pluginsRouter.navigateTo(targetUrl);
  router.navigateTo(targetUrl);
}

function clickHandler(linkSelector) {
  return async (e) => {
    if (e.target.matches(linkSelector)) {
      e.preventDefault();
      await pluginsRouter.navigateTo(e.target.href);
      router.navigateTo(e.target.href);
    }
  };
}

/**
 * appSetup returns an app instance, executing both view router and plugins
 * router. It connects plugins reducer into the core store, and connects all
 * plugins routes.
 *
 * When an user hits a route, the app will first load the plugins routes and
 * execute their respective fetch methods. When done, load the view.
 *
 * @param {{
 *  plugins: Array,
 *  pluginsProxyConfig: Object,
 *  viewRoutes: Array,
 *  linkSelector: string
 * }}
 */
export async function appSetup({
  plugins,
  pluginsProxyConfig,
  viewRoutes,
  linkSelector = "[data-link]",
}) {
  // Validate App Plugins
  plugins.every(validatePlugin);

  // Proxy plugin routes
  pluginsRouter.setupProxyConfig(pluginsProxyConfig);

  let pluginsRoutes = [];
  // Connect plugins reducers on store
  for (const plugin of plugins) {
    if (plugin.reducers) await connectReducers(plugin.reducers);
    if (plugin.routes) {
      pluginsRoutes = mergeRoutes(pluginsRoutes, plugin.routes);
    }
  }

  return {
    async init() {
      await store.dispatch(api.fetch());
      await pluginsRouter.init({ routes: pluginsRoutes });
      await router.init({
        routes: viewRoutes,
        popStateHandler,
        clickHandler: clickHandler(linkSelector),
      });
    },
  };
}
