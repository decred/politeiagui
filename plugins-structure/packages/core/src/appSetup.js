import { connectReducers, store, validatePlugin } from "./";
import { api } from "./api";
import { router } from "./router";
import { initializers as recordsInitializers } from "./records/initializers";

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

/**
 * appSetup returns an app instance. It connects plugins reducers into the core
 * store, and connects all plugins initializers.
 *
 * @param {{ plugins: Array, initializersByRoutesMap: Object }} appConfig
 */
export function appSetup({ plugins, config }) {
  let initializers = recordsInitializers;
  plugins.every(validatePlugin);

  // Connect plugins reducers and initializers
  for (const plugin of plugins) {
    if (plugin.reducers) connectReducers(plugin.reducers);
    if (plugin.initializers) {
      initializers = mergeInitializers(initializers, plugin.initializers);
    }
  }

  return {
    config,
    /**
     * init is responsible for initializing the app.
     * @param {{ routes: Array }} initParams
     */
    async init({ routes } = {}) {
      await store.dispatch(api.fetch());
      await router.init({
        routes,
      });
    },
    /**
     * getConfig returns the app config.
     * @returns {Object} config
     */
    getConfig() {
      return config;
    },
    /**
     * createRoute is an interface for creating app routes. Before rendering
     * some route view, execute all initializers actions for given `initIds`.
     * @param {{ path: string,
     *  view: Function,
     *  initIds: Array,
     *  cleanup: Function
     * }} routeParams
     */
    createRoute({ path, view, initIds = [], cleanup } = {}) {
      const routeInitializersActions = initializers
        .filter((init) => initIds.includes(init.id))
        .map((init) => init.action);
      return {
        path,
        cleanup,
        view: async (routeParams) => {
          for (const action of routeInitializersActions) {
            await action();
          }
          return await view(routeParams);
        },
      };
    },
  };
}
