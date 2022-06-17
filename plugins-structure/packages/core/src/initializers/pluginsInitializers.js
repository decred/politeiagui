import isArray from "lodash/fp/isArray";
import { pathToRegex } from "../router/helpers";

/**
 * validPluginsInitializers returns if given every init from `initializers`
 * array has both `id` and `action` attributes.
 * @param {Array} initializers
 * @returns {Bool} isValid
 */
export function validPluginsInitializers(initializers) {
  return (
    initializers &&
    isArray(initializers) &&
    initializers.every((init) => init.id && init.action)
  );
}

/**
 * InitByRoutesMap is an object that maps the received init to target initializers.
 * @typedef {Object.<string, string[]>} InitByRoutesMap
 */
/**
 * proxyRoutesInitializers is responsible for handling init redirecting. It receives a
 * `initializersByRoutesMap` object, and, for given `targetRoutePath`, returns the corresponding
 * matching init from `allInitializers` + proxied targets initializers.
 * @param {InitByRoutesMap} initializersByRoutesMap proxy map
 * @returns {ProxyHandler} Plugins Initializers Proxy handler
 */
function proxyRoutesInitializers(initializersByRoutesMap) {
  return {
    get: (allInitializers, targetRoutePath) => {
      function findInitializer(path) {
        return allInitializers.find((init) => init.id === path);
      }
      const proxyMapMatch = Object.keys(initializersByRoutesMap).find((route) =>
        targetRoutePath.match(pathToRegex(route))
      );
      // Get targets once we know the correct path.
      const targets =
        (initializersByRoutesMap && initializersByRoutesMap[proxyMapMatch]) ||
        [];
      const unhandledTarget = findInitializer(targetRoutePath);
      const proxiedTargets = targets.map(findInitializer);
      // Remove undefined values. In case some initializer or target does not
      // match current initializers.
      return [unhandledTarget, ...proxiedTargets].filter((t) => !!t);
    },
  };
}

function configurePluginsInitializers() {
  let initializers = null;
  let initializersByRoutesMap = {};

  async function verifyInitializersMatches(pathname) {
    const initializersByRoutePath = new Proxy(
      initializers,
      proxyRoutesInitializers(initializersByRoutesMap)
    );
    // Get initializers match from proxy
    const targetInitializers = initializersByRoutePath[pathname];
    for (const init of targetInitializers) {
      // Every plugin init has its own action method, and plugins router
      // listens to window location pathname and triggers the fetching.
      if (init.action) {
        await init.action();
      }
    }
  }

  return {
    /**
     * init receives an URL and executes the action for initializers that match
     * the given pathname.
     * @param {string} url
     */
    async init(url) {
      if (!initializers) {
        throw Error(
          "pluginsInitializers is not configured. Use the setup method"
        );
      }
      // Accepts pathnames and urls. Handle Pathnames correctly
      let pathname;
      try {
        pathname = new URL(url).pathname;
      } catch (_) {
        pathname = url;
      }
      await verifyInitializersMatches(pathname);
    },
    /**
     * setupInitializersByRoute applies a InitByRoutesMap
     * @param {InitByRoutesMap} map
     */
    setupInitializersByRoute(map) {
      initializersByRoutesMap = map;
    },
    cleanup() {
      initializers = null;
      initializersByRoutesMap = {};
    },
    /**
     * setup initializes the router for given initializers config
     * @param {{ initializers: Array }} Config
     */
    async setup({ initializers: pluginsInitializers } = {}) {
      if (
        !pluginsInitializers ||
        !validPluginsInitializers(pluginsInitializers)
      ) {
        throw TypeError("`initializers` must be an array of { id, action } ");
      }
      initializers = pluginsInitializers;
      await verifyInitializersMatches(window.location.pathname);
    },
  };
}

// TODO: description
export const pluginsInitializers = configurePluginsInitializers();
