import { connectReducers, store, validatePlugin } from "./";
import { api } from "./api";
import { router } from "./router";
import { pluginsInitializers } from "./initializers";
import { initializers as coreInitializers } from "./initializers";

function mergeInitializers(initializers, targetInitializers) {
  let mergedInitializers = initializers;
  for (const initializer of targetInitializers) {
    if (mergedInitializers.find((mi) => mi.id === initializer.id)) {
      console.warn(
        `There are multiple plugins initializers with the '${initializer.id}' ID. Pay attention.`
      );
    }
    mergedInitializers = [...mergedInitializers, initializer];
  }
  return mergedInitializers;
}

async function popStateHandler(e) {
  const targetUrl = e.target.window.location.pathname;
  await pluginsInitializers.initializeFromUrl(targetUrl);
  router.navigateTo(targetUrl);
}

function clickHandler(linkSelector) {
  return async (e) => {
    if (e.target.matches(linkSelector)) {
      e.preventDefault();
      await pluginsInitializers.initializeFromUrl(e.target.href);
      router.navigateTo(e.target.href);
    }
  };
}

/**
 * appSetup returns an app instance. It connects plugins reducers into the core
 * store, and connects all plugins initializers.
 *
 * When an user hits a route, the app will first load the corresponding plugins
 * initializers for the route path and execute their respective actions. When
 * done, the router will load the route view.
 *
 * @param {{
 *  plugins: Array,
 *  pluginsInitializersByRoutesMap: Object,
 *  routes: Array,
 *  linkSelector: string
 * }}
 */
export function appSetup({
  plugins,
  pluginsInitializersByRoutesMap,
  routes,
  linkSelector = "[data-link]",
}) {
  let initializers = coreInitializers;
  plugins.every(validatePlugin);
  pluginsInitializers.setupInitializersByRoute(pluginsInitializersByRoutesMap);
  // Connect plugins reducers and initializers
  for (const plugin of plugins) {
    if (plugin.reducers) connectReducers(plugin.reducers);
    if (plugin.initializers) {
      initializers = mergeInitializers(initializers, plugin.initializers);
    }
  }

  return {
    async init() {
      await store.dispatch(api.fetch());
      await pluginsInitializers.setup({ initializers });
      await router.init({
        routes,
        popStateHandler,
        clickHandler: clickHandler(linkSelector),
      });
    },
    async navigateTo(url) {
      await pluginsInitializers.initializeFromUrl(url);
      router.navigateTo(url);
    },
  };
}
