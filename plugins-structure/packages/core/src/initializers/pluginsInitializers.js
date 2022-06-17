import isArray from "lodash/fp/isArray";
import isEmpty from "lodash/fp/isEmpty";
import { pathToRegex } from "../router/helpers";

const NO_MAP_WARNING =
  "You currently have no initializers mapped to routes. You can setup the map using the `configure` method. If no map is provided, you won't load initializers for routes paths";
const NOT_CONFIGURED_ERROR =
  "pluginsInitializers is not configured. Use the `configure` method";

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

function findInitializerById(initializers, id) {
  return initializers.find((init) => init.id === id);
}

/**
 * InitializersByRoutesMap is an object that maps a route path to corresponding plugins
 * initializers ids.
 * @typedef {Object.<string, string[]>} InitializersByRoutesMap
 */
/**
/**
 * getInitializersByRoutePath returns the plugins initializers using the 
 * `initializersByRoutesMap` for given pathname.
 * @param {Array} pluginsInitializers
 * @param {InitializersByRoutesMap} initializersByRoutesMap
 * @returns {Array}
 */
function getInitializersByRoutePath(
  pluginsInitializers,
  initializersByRoutesMap,
  targetPath
) {
  const routeMatch = Object.keys(initializersByRoutesMap).find((route) =>
    targetPath.match(pathToRegex(route))
  );
  const ids =
    (initializersByRoutesMap && initializersByRoutesMap[routeMatch]) || [];

  return ids.map((id) => findInitializerById(pluginsInitializers, id));
}

function configurePluginsInitializers() {
  let initializers = null;
  let initializersByRoutesMap = {};

  function getIsConfigured() {
    if (!initializers) throw Error(NOT_CONFIGURED_ERROR);
    return true;
  }

  async function verifyInitializersMatches(pathname) {
    const matchingInitializers = getInitializersByRoutePath(
      initializers,
      initializersByRoutesMap,
      pathname
    );
    for (const initializer of matchingInitializers) {
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
      getIsConfigured();
      if (isEmpty(initializersByRoutesMap)) console.warn(NO_MAP_WARNING);

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
     * initializeFromId executes the action for the initializer correspondent to
     * the `id` param.
     * @param {string} id
     */
    async initializeFromId(id) {
      getIsConfigured();
      const initializer = findInitializerById(initializers, id);
      if (initializer) {
        await initializer.action();
      }
    },
    getInitializers() {
      return initializers;
    },
    cleanup() {
      initializers = null;
      initializersByRoutesMap = {};
    },
    /**
     * configure sets plugins `initializers` and `initializersRoutesByMap`.
     * @param {{
     *  initializers: Array,
     *  initializersByRoutesMap: InitializersByRoutesMap
     * }} Config
     */
    configure({ initializers: inits, initializersByRoutesMap: map } = {}) {
      if (!inits || !validPluginsInitializers(inits)) {
        throw TypeError("`initializers` must be an array of { id, action } ");
      }
      if (isEmpty(map)) console.warn(NO_MAP_WARNING);
      initializers = inits;
      initializersByRoutesMap = map;
    },
  };
}

export const pluginsInitializers = configurePluginsInitializers();
