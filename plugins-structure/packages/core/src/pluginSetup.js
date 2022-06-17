import isString from "lodash/fp/isString";
import isArray from "lodash/fp/isArray";
import { validPluginsRoutes } from "./router/pluginsRouter";

export function validatePlugin({ routes, reducers, name }) {
  const validReducers =
    isArray(reducers) &&
    reducers.every((reducer) => reducer.key && reducer.reducer);
  if (reducers && !validReducers) {
    throw TypeError("`reducers` must be array of { key, reducer }");
  }

  if (!name || !isString(name)) {
    throw TypeError("`name` is required and must be a string");
  }

  if (routes && !validPluginsRoutes(routes)) {
    throw TypeError("`routes` must be an array of { path, fetch } ");
  }
}

/**
 * pluginSetup is the interface used for plugins validation and setup.
 * @param {Object} pluginParams
 */
export function pluginSetup({ routes, reducers, name }) {
  validatePlugin({ routes, reducers, name });
  return {
    reducers,
    routes,
    name,
  };
}
