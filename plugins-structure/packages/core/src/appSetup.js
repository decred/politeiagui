import { connectReducers, store, validatePlugin } from "./";
import { api } from "./api";
import { router } from "./router";
import { initializers as recordsInitializers } from "./records/initializers";
import uniq from "lodash/fp/uniq";

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

function getInitializersActionsByIds(initializers, ids, path) {
  const actions = [];
  for (const id of ids) {
    const init = initializers.find((i) => i.id === id);
    if (!init)
      throw Error(
        `createRoute: initializer id "${id}" for path "${path}" isn't defined.`
      );
    actions.push(init.action);
  }
  return actions;
}

function validateUniqPluginInitializerIds(ids = []) {
  const uniqIds = uniq(ids);
  if (uniqIds.length !== ids.length) {
    throw Error(`"pluginInitializerIds" must be an array of uniq values`);
  }
  return true;
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
    async init({ routes, routerOptions } = {}) {
      await store.dispatch(api.fetch());
      await router.init({ routes, options: routerOptions });
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
     * some route view, execute all initializers actions for given
     * `pluginInitializerIds`.
     * @param {{ path: string,
     *  view: Function,
     *  pluginInitializerIds: string[],
     *  cleanup: Function
     * }} routeParams
     */
    createRoute({ path, view, pluginInitializerIds = [], cleanup } = {}) {
      validateUniqPluginInitializerIds(pluginInitializerIds);
      const actions = getInitializersActionsByIds(
        initializers,
        pluginInitializerIds
      );
      return {
        path,
        cleanup,
        view: async (routeParams) => {
          await Promise.all([...actions.map((a) => a())]);
          return await view(routeParams);
        },
      };
    },
  };
}
