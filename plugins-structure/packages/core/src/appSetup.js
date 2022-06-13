import { connectReducers, store, validatePlugin } from "./";
import { api } from "./api";
import { findMatch, pluginsRouter, router } from "./router";
import { routes as coreRoutes } from "./routes";

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
 *  pluginsProxyMap: Object,
 *  viewRoutes: Array,
 *  linkSelector: string
 * }}
 */
export function appSetup({
  plugins,
  pluginsProxyMap,
  viewRoutes,
  linkSelector = "[data-link]",
}) {
  // Initialize router with core routes.
  let pluginsRoutes = coreRoutes;
  // Validate App Plugins
  plugins.every(validatePlugin);
  // Proxy plugin routes
  pluginsRouter.setupProxyMap(pluginsProxyMap);
  // Connect plugins reducers on store
  for (const plugin of plugins) {
    if (plugin.reducers) connectReducers(plugin.reducers);
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
    async navigateTo(url) {
      await pluginsRouter.navigateTo(url);
      router.navigateTo(url);
    },
  };
}
