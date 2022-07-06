import { connectReducers, store, validatePlugin } from "./";
import { api } from "./api";
import { router } from "./router";
import { services as recordsServices } from "./records/services";
import { listener } from "./listeners";

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
  let idListeners = [];
  for (const { listener, effect } of routeServices) {
    if (listener) {
      idListeners.push({
        actionCreator: listener.actionCreator,
        effect: listener.injectEffect(effect),
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
 * store, connects all plugins services and register app level listeners
 * @param {{ plugins: Array, listeners: Array, config: Object }}
 */
export function appSetup({ plugins, listeners = [], config }) {
  let appServices = recordsServices;
  plugins.every(validatePlugin);

  // Connect plugins reducers and services
  for (const plugin of plugins) {
    if (plugin.reducers) connectReducers(plugin.reducers);
    if (plugin.services) {
      appServices = mergeAppAndPluginServices(appServices, plugin.services);
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
    } = {}) {
      const routeServices = addRouteServicesProperties(
        appServices,
        setupServices
      );
      const allListeners = mergeListeners(routeServices, listeners);

      return {
        path,
        cleanup: () => {
          cleanup();
          clearListeners(allListeners);
        },
        view: async (routeParams) => {
          registerListeners(allListeners);
          for (const service of routeServices) {
            if (service.action) {
              await service.action();
            }
          }
          return await view(routeParams);
        },
      };
    },
  };
}
