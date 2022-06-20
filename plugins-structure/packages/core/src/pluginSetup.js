import isString from "lodash/fp/isString";
import isArray from "lodash/fp/isArray";
import isFunction from "lodash/fp/isFunction";

function validPluginsInitializers(initializers) {
  return (
    initializers &&
    isArray(initializers) &&
    initializers.every((init) => isString(init.id) && isFunction(init.action))
  );
}

export function validatePlugin({ initializers, reducers, name }) {
  const validReducers =
    isArray(reducers) &&
    reducers.every((reducer) => reducer.key && reducer.reducer);
  if (reducers && !validReducers) {
    throw TypeError("`reducers` must be array of { key, reducer }");
  }

  if (!name || !isString(name)) {
    throw TypeError("`name` is required and must be a string");
  }

  if (initializers && !validPluginsInitializers(initializers)) {
    throw TypeError("`initializers` must be an array of { id, action } ");
  }
}

/**
 * pluginSetup is the interface used for plugins validation and setup.
 * @param {Object} pluginParams
 */
export function pluginSetup({ initializers, reducers, name }) {
  validatePlugin({ initializers, reducers, name });
  return {
    reducers,
    initializers,
    name,
  };
}
