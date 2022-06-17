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
 * InitByRoutesMap is an object that maps a route path to corresponding plugins
 * initializers ids.
 * @typedef {Object.<string, string[]>} InitByRoutesMap
 */
/**
/**
 * getInitializersByRoutePath returns the plugins initializers using the 
 * `initializersByRoutesMap` for given pathname.
 * @param {Array} pluginsInitializers
 * @param {InitByRoutesMap} initializersByRoutesMap
 * @returns {Array}
 */
function getInitializersByRoutePath(
  pluginsInitializers,
  initializersByRoutesMap,
  targetPath
) {
  function findInitializersByTarget(target) {
    return pluginsInitializers.find((init) => init.id === target);
  }
  const routeMatch = Object.keys(initializersByRoutesMap).find((route) =>
    targetPath.match(pathToRegex(route))
  );
  // Get targets once we know the correct path.
  const targets =
    (initializersByRoutesMap && initializersByRoutesMap[routeMatch]) || [];

  return targets.map(findInitializersByTarget);
}

function configurePluginsInitializers() {
  let initializers = null;
  let initializersByRoutesMap = {};

  async function verifyInitializersMatches(pathname) {
    // Get initializers match from map
    const matchingInitializers = getInitializersByRoutePath(
      initializers,
      initializersByRoutesMap,
      pathname
    );
    for (const initializer of matchingInitializers) {
      // Every plugin initializer has its own action method, and plugins router
      // listens to window location pathname and triggers the fetching.
      if (initializer.action) {
        await initializer.action();
      }
    }
  }

  return {
    /**
     * initializeFromUrl executes the action for initializers that match
     * the given `url` param.
     * @param {string} url
     */
    async initializeFromUrl(url) {
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
     * setupInitializersByRoute applies a InitByRoutesMap so initializers can
     * be executed for each route.
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

export const pluginsInitializers = configurePluginsInitializers();
