import { connectReducers, store as defaultStore, validatePlugin } from "./";
import { api } from "./api";
import { router } from "./router";
import { services as recordsServices } from "./records/services";
import { services as globalServices } from "./globalServices";
import { services as userServices } from "./user/services";
import { pluginServices as apiServices } from "./api/services";
import { listener } from "./listeners";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import cloneDeep from "lodash/cloneDeep";

/**
 * @callback ConditionFn - A function that returns a boolean value indicating
 * whether the route should be rendered or not.
 * @param {Object} params - Route params.
 * @param {Function} getState - Redux getState function.
 * @returns {boolean} - Whether the route should be rendered or not.
 */

/**
 * CreateRouteParams is a type definition for the params object that is passed
 * to the app's createRoute function.
 * @typedef {{
 *  path: string,
 *  view: Function,
 *  title: string,
 *  setupServices: Array,
 *  listeners: Array
 *  cleanup: Function
 *  when: ConditionFn
 *  otherwise: Function
 * }} CreateRouteParams
 */

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

function validatServicesSetups(setups) {
  const ids = setups.map((s) => s.id);
  const uniqIds = [];
  for (const id of ids) {
    if (uniqIds.indexOf(id) === -1) {
      uniqIds.push(id);
    } else {
      throw Error(
        `You tried to setup the ${id} service twice on the same 'setupServices' config. Please consider using a more generic effect customizer.`
      );
    }
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

  let appServices = [
    ...recordsServices,
    ...globalServices,
    ...userServices,
    ...apiServices,
  ];
  plugins.every(validatePlugin);

  // Connect plugins reducers and services
  for (const plugin of plugins) {
    if (plugin.reducers) connectReducers(plugin.reducers, store);
    if (plugin.services) {
      appServices = mergeAppAndPluginServices(appServices, plugin.services);
    }
  }

  // Connect app global services setup
  validatServicesSetups(setupServices);
  const globalAppServices = addRouteServicesProperties(
    appServices,
    setupServices
  );
  const globalListeners = mergeListeners(globalAppServices, listeners);

  return {
    config,
    /**
     * init is responsible for initializing the app.
     * @param {{ routes: Array }} initParams
     */
    async init({ routes, routerOptions, errorView } = {}) {
      // Only register global listeners once the app init is called.
      registerListeners(globalListeners);
      // Setup api. It is required to load csrf tokens and other required
      // information to make api calls.
      await store.dispatch(api.fetch());
      const apiStatus = api.selectStatus(store.getState());
      if (apiStatus == "failed") {
        throw Error(api.selectError(store.getState()));
      }
      // Execute all actions from global services before initializing the router
      for (const service of globalAppServices) {
        if (service.action) {
          await service.action({
            getState: store.getState,
            dispatch: store.dispatch,
          });
        }
      }
      // Now, after all global services actions are executed, we can initialize
      // the router.
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
     * setDocumentTitle receives and updates the document title with given
     * `title` param.
     * @param {string} title
     */
    setDocumentTitle(title) {
      if (title && isString(title)) {
        const routeTitle = this.createRouteTitle(title);
        document.title = routeTitle;
      }
    },
    /**
     * createRoute is an interface for creating app routes. Before rendering
     * some route view, execute all services actions for given `service`.
     * @param {CreateRouteParams} routeParams
     */
    createRoute({
      path,
      view,
      title,
      setupServices = [],
      listeners = [],
      cleanup = () => {},
      when = () => true,
      otherwise = () => {},
    } = {}) {
      validatServicesSetups(setupServices);
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
          // onlu render view if when is true
          const shouldRenderView = when(routeParams, store.getState);
          if (!shouldRenderView) {
            await otherwise(routeParams, (path) => router.navigateTo(path));
            return false;
          }

          const actionsDispatchesQueue = [];
          registerListeners(allListeners);

          for (const service of routeServices) {
            // We must cache all dispatches, because they might trigger services
            // listeners effects that may not have executed their setup actions
            // yet. Once they are properly setup, we can execute all cached
            // actions.
            if (service.action) {
              await service.action({
                params: routeParams,
                getState: store.getState,
                dispatch: (fn) => {
                  actionsDispatchesQueue.push(fn);
                },
              });
            }
          }
          // Now we can execute all cached actionsDispatchesQueue, because all
          // actions have been successfully setup.
          for (const fn of actionsDispatchesQueue) {
            await store.dispatch(fn);
          }
          await view(routeParams);
          return true;
        },
      };
    },
    /**
     * createSubRouter is an interface for creating route wrappers, which are
     * routes that rendered by the router, and they wrap other sub-routes.
     *
     * Every sub-route will be modified to include and execute the wrapper route
     * methods and properties. Modifications include:
     *
     * `path`: must be relative to the wrapper route path. For example:
     * if the wrapper route path is `/app` and the sub-route path is `/home`,
     * the final path for the sub-route  will be `/app/home`.
     *
     * `title`: will be rendered as `wrapper-title sub-router-title`.
     *
     * `view`: will execute first the wrapper view, and then the sub-route view.
     *
     * If the wrapper route has a `when` condition, the sub-route will only be
     * rendered if the wrapper route `when` condition is true.
     *
     * Also, if user navigates to the wrapper route path, the router will
     * automatically render first sub-route path view (by default).
     *
     * This is useful for implementing authentication, for example, where you
     * can wrap authenticated routes with a gateway route that checks if the
     * user is authenticated and redirects to the login page if not.
     *
     * Each subRoute must be either created by the `createRoute` method,
     * by the `createSubRouter` method, or be a route that is accepted by the
     * router.
     *
     * Example:
     *
     * ```javascript
     * const routes = createSubRouter({
     *  path: '/app',
     *  view: myWrapperView,
     *  title: 'App',
     *  subRoutes: [
     *    createRoute({
     *      view: MyHomeView,
     *      path: '/home',
     *      title: 'Home',
     *      ...subRouteProps
     *    }),
     *    ...otherSubRoutes,
     *  ],
     *  ...wrapperRouteProps
     * });
     * ```
     */
    createSubRouter({
      path,
      view,
      setupServices = [],
      listeners = [],
      cleanup,
      title,
      when = () => true,
      otherwise = () => {},
      subRoutes = [],
    }) {
      const parentRoute = this.createRoute({
        path,
        setupServices,
        listeners,
        cleanup,
        title,
        when,
        otherwise,
        view,
      });
      const routes = subRoutes.map((route) => {
        return {
          cleanup: () => {
            route.cleanup();
            parentRoute.cleanup();
          },
          path: `${path}${route.path}`,
          title: `${title} ${route.title}`,
          view: async (...params) => {
            const parentOk = await parentRoute.view(...params);
            if (parentOk) {
              await route.view(...params);
            }
          },
        };
      });
      // First route is always the default.
      const defaultRoute = cloneDeep(routes[0]);
      defaultRoute.path = path;
      return [defaultRoute, ...routes];
    },
  };
}
