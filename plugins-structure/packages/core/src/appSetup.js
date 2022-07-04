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
     * some route view, execute all initializers actions for given `initialize`.
     * @param {{ path: string,
     *  view: Function,
     *  initialize: Array,
     *  listeners: Array
     *  cleanup: Function
     * }} routeParams
     */
    createRoute({ path, view, initialize = [], listeners = [], cleanup } = {}) {
      const routeInitializers = initializers.reduce((prev, cur) => {
        const el = initialize.find((val) => val.id === cur.id);
        if (el) {
          return [
            ...prev,
            {
              ...cur,
              ...el,
            },
          ];
        }
        return prev;
      }, []);

      let idListeners = [];
      for (const initializer of routeInitializers) {
        if (initializer.listener) {
          idListeners.push({
            actionCreator: initializer.listener.actionCreator,
            effect: initializer.listener.injectEffect(initializer.effect),
          });
        }
      }
      const allListeners = [...idListeners, ...listeners];
      return {
        path,
        cleanup: () => {
          cleanup();
          clearListeners(allListeners);
        },
        view: async (routeParams) => {
          registerListeners(allListeners);
          for (const init of routeInitializers) {
            if (init.action) {
              await init.action();
            }
          }
          return await view(routeParams);
        },
      };
    },
  };
}
