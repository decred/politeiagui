import { connectReducers, store, validatePlugin } from "./";
import { api } from "./api";
import { router } from "./router";
import { initializers as recordsInitializers } from "./records/initializers";
import { listener } from "./listeners";

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

function registerListeners(listeners) {
  for (let l of listeners) {
    listener.startListening(l);
  }
}

function clearListeners(listeners) {
  for (let l of listeners) {
    listener.stopListening(l);
  }
}

/**
 * appSetup returns an app instance. It connects plugins reducers into the core
 * store, connects all plugins initializers and register app level listeners
 * @param {{ plugins: Array, listeners: Array, initializersByRoutesMap: Object }} appConfig
 */
export function appSetup({ plugins, listeners = [], config }) {
  let initializers = recordsInitializers;
  plugins.every(validatePlugin);

  // Connect plugins reducers and initializers
  for (const plugin of plugins) {
    if (plugin.reducers) connectReducers(plugin.reducers);
    if (plugin.initializers) {
      initializers = mergeInitializers(initializers, plugin.initializers);
    }
  }

  registerListeners(listeners);

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
     * some route view, execute all initializers actions for given `initializerIds`.
     * @param {{ path: string,
     *  view: Function,
     *  initializerIds: Array,
     *  listeners: Array
     *  cleanup: Function
     * }} routeParams
     */
    createRoute({
      path,
      view,
      initializerIds = [],
      listeners = [],
      cleanup,
    } = {}) {
      const routeInitializerActions = initializers
        .filter((init) => initializerIds.includes(init.id))
        .map((init) => init.action);
      return {
        path,
        cleanup: () => {
          cleanup();
          clearListeners(listeners);
        },
        view: async (routeParams) => {
          registerListeners(listeners);
          for (const action of routeInitializerActions) {
            await action();
          }
          return await view(routeParams);
        },
      };
    },
  };
}
