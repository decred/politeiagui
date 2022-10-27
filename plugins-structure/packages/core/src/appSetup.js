import { connectReducers, store as defaultStore, validatePlugin } from "./";
import { api } from "./api";
import { router } from "./router";
import { services as recordsServices } from "./records/services";
import { services as globalServices } from "./globalServices";
import { listener } from "./listeners";
import uniq from "lodash/fp/uniq";
import isArray from "lodash/isArray";

function getRouteTitle(appTitle, title) {
  if (!title && appTitle) return appTitle;
  if (title && !appTitle) return title;
  return [title, appTitle].join(" | ");
}

function mergeAppAndPluginServices(services, targetServices) {
  let mergedServices = services;
  for (const service of targetServices) {
    if (mergedServices.find((mi) => mi.id === service.id)) {
      console.warn(
        `There are multiple plugins services with the '${service.id}' ID. Pay attention.`
      );
    }
    mergedServices = [...mergedServices, service];
  }
  return mergedServices;
}

function mergeListeners(routeServices, listeners) {
  const idListeners = [];
  for (const { listenerCreator, effect } of routeServices) {
    if (listenerCreator) {
      idListeners.push({
        actionCreator: listenerCreator.actionCreator,
        type: listenerCreator.type,
        effect: listenerCreator.injectEffect(effect),
        matcher: listenerCreator.matcher,
      });
    }
  }
  return [...idListeners, ...listeners];
}

function addRouteServicesProperties(appServices, routeServices) {
  const serviceInRoute = (init) => (val) => val.id === init.id;
  const servicesReducer = (newAppServicesArray, appService) => {
    const routeService = routeServices.find(serviceInRoute(appService));
    // If is in route, merge the content of routeService and appService
    // appService = {id, action}
    // routeService = {id, listener, view, ...}
    // newService = {id, action, listener, view, ...}
    // else do nothing and return the array to go to the next iteration
    if (routeService) {
      return [
        ...newAppServicesArray,
        {
          ...appService,
          ...routeService,
        },
      ];
    }
    return newAppServicesArray;
  };
  return appServices.reduce(servicesReducer, []);
}

function registerListeners(listeners) {
  for (const l of listeners) {
    listener.startListening(l);
  }
}

function clearListeners(listeners) {
  for (const l of listeners) {
    listener.stopListening({ ...l, cancelActive: true });
  }
}

function validateServicesIds(ids = []) {
  const uniqIds = uniq(ids);
  if (uniqIds.length !== ids.length) {
    throw Error("services ids must be an array of uniq values");
  }
  return true;
}

/**
 * appSetup returns an app instance. It connects plugins reducers into the core
 * store, connects all plugins services and register app level listeners
 * @param {{ plugins: Array, listeners: Array, config: Object }}
 */
export function appSetup({
  plugins,
  listeners = [],
  config = {},
  store = defaultStore,
  setupServices = [],
}) {
  if (!isArray(plugins)) {
    throw Error("'plugins' must be an array");
  }
  if (!isArray(listeners)) {
    throw Error("'listeners' must be an array");
  }

  let appServices = [...recordsServices, ...globalServices];
  plugins.every(validatePlugin);

  // Connect plugins reducers and services
  for (const plugin of plugins) {
    if (plugin.reducers) connectReducers(plugin.reducers, store);
    if (plugin.services) {
      appServices = mergeAppAndPluginServices(appServices, plugin.services);
    }
  }

  // Connect app global services setup
  validateServicesIds(setupServices);
  const globalAppServices = addRouteServicesProperties(
    appServices,
    setupServices
  );
  const globalListeners = mergeListeners(globalAppServices, listeners);

  registerListeners(globalListeners);

  return {
    config,
    /**
     * init is responsible for initializing the app.
     * @param {{ routes: Array }} initParams
     */
    async init({ routes, routerOptions, errorView } = {}) {
      await store.dispatch(api.fetch());
      const apiStatus = api.selectStatus(store.getState());
      if (apiStatus == "failed") {
        throw Error(api.selectError(store.getState()));
      }
      await router.init({ routes, options: routerOptions, errorView });
    },
    /**
     * getConfig returns the app config.
     * @returns {Object} config
     */
    getConfig() {
      return config;
    },
    /**
     * createRouteTitle returns the route title in the following format:
     * `{title} | {app-title}`.
     *
     * Ex:
     * ```
     * createRouteTitle("my title")
     * // "my title | My App"
     * ```
     * @param {String} title
     * @returns {String}
     */
    createRouteTitle(title) {
      return getRouteTitle(config.title, title);
    },
    /**
     * createRoute is an interface for creating app routes. Before rendering
     * some route view, execute all services actions for given `service`.
     * @param {{ path: string,
     *  view: Function,
     *  setupServices: Array,
     *  listeners: Array
     *  cleanup: Function
     * }} routeParams
     */
    createRoute({
      path,
      view,
      setupServices = [],
      listeners = [],
      cleanup,
      title,
    } = {}) {
      validateServicesIds(setupServices);
      const routeServices = addRouteServicesProperties(
        appServices,
        setupServices
      );
      const allListeners = mergeListeners(routeServices, listeners);

      return {
        title: this.createRouteTitle(title),
        path,
        cleanup: () => {
          cleanup();
          clearListeners(allListeners);
        },
        view: async (routeParams) => {
          registerListeners(allListeners);
          for (const service of routeServices) {
            if (service.action) {
              // Allow services to setup its own action parameters
              let params = routeParams;
              if (service.setActionPayload) {
                params = service.setActionPayload(
                  store.getState(),
                  routeParams
                );
              }
              await service.action(params);
            }
          }
          return await view(routeParams);
        },
      };
    },
  };
}
