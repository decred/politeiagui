import isString from "lodash/fp/isString";
import isArray from "lodash/fp/isArray";
/**
 * ServiceAction is the method to be executed by an intializer.
 * @callback ServiceAction
 * @returns {Promise}
 */
/**
 * Effect is the function to be executed when the action triggers.
 * @callback Effect
 * @returns {Promise}
 */

/**
 * Service is an `action` that will setup the plugin for usage in some given
 * `id` case.
 * @typedef {{
 *  id: string,
 *  action: ServiceAction,
 *  effect: Effect
 * }} Service
 */

/**
 * validPluginServices checks if all plugins services are valid.
 * @param {Service[]} services
 * @returns {boolean} isValid
 */
function validPluginServices(services) {
  return (
    services && isArray(services) && services.every((init) => isString(init.id))
  );
}

export function validatePlugin({ services, reducers, name }) {
  const validReducers =
    isArray(reducers) &&
    reducers.every((reducer) => reducer.key && reducer.reducer);
  if (reducers && !validReducers) {
    throw TypeError("`reducers` must be array of { key, reducer }");
  }

  if (!name || !isString(name)) {
    throw TypeError("`name` is required and must be a string");
  }

  if (services && !validPluginServices(services)) {
    throw TypeError(
      "`services` must be an array of objects where the id key is required"
    );
  }
}

/**
 * pluginSetup is the interface used for plugins setup and validation.
 *
 * @param {{
 *  services: Service[],
 *  reducers: Array,
 *  name: string
 * }} pluginParams
 */
export function pluginSetup({ services, reducers, name }) {
  validatePlugin({ services, reducers, name });
  return {
    reducers,
    services,
    name,
    initialize: async (id) => {
      const service = services.find((init) => init.id === id);
      if (!service) return;
      return await service.action();
    },
  };
}
