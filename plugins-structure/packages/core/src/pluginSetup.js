import isString from "lodash/fp/isString";
import isArray from "lodash/fp/isArray";

export function validatePlugin({ routes, reducers, name }) {
  const validReducers =
    isArray(reducers) &&
    reducers.every((reducer) => reducer.key && reducer.reducer);
  if (reducers && !validReducers) {
    throw Error("`reducers` must be array of { key, reducer }");
  }

  if (!name || !isString(name)) {
    throw Error("`name` is required and must be a string");
  }

  const validRoutes =
    isArray(routes) && routes.every((route) => route.path && route.fetch);
  if (routes && !validRoutes) {
    throw Error("`routes` must be an array of { path, fetch } ");
  }
}

/**
 * Plugin is the interface for plugins validation and setup.
 * @param {Object} pluginParams
 */
export function Plugin({ routes, reducers, name }) {
  validatePlugin({ routes, reducers, name });
  return {
    reducers,
    routes,
    name,
  };
}
