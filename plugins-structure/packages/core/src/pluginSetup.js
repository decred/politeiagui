import isString from "lodash/fp/isString";
import isArray from "lodash/fp/isArray";
/**
 * InitializerAction is the method to be executed by an intializer.
 * @callback InitializerAction
 * @returns {Promise}
 */

/**
 * Initializer is an `action` that will setup the plugin for usage in some given
 * `id` case.
 * @typedef {{
 *  id: string,
 *  action: InitializerAction
 * }} Initializer
 */

/**
 * validPluginsInitializers checks if all plugins initializers are valid.
 * @param {Initializer[]} initializers
 * @returns {boolean} isValid
 */
function validPluginsInitializers(initializers) {
  return (
    initializers &&
    isArray(initializers) &&
    initializers.every((init) => isString(init.id))
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
    throw TypeError(
      "`initializers` must be an array of objects where the id key is required"
    );
  }
}

/**
 * pluginSetup is the interface used for plugins setup and validation.
 *
 * @param {{
 *  initializers: Initializer[],
 *  reducers: Array,
 *  name: string
 * }} pluginParams
 */
export function pluginSetup({ initializers, reducers, name }) {
  validatePlugin({ initializers, reducers, name });
  return {
    reducers,
    initializers,
    name,
    initialize: async (id) => {
      const initializer = initializers.find((init) => init.id === id);
      if (!initializer) return;
      return await initializer.action();
    },
  };
}
