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
 * PluginService is an `action` that will setup the plugin for usage in some given
 * `id` case.
 * @typedef {{
 *  id: string,
 *  action: ServiceAction,
 *  effect: Effect
 * }} PluginService
 */
/**
 * ServiceParams - TODO: description
 * @typedef {{
 *  onSetup: ServiceAction,
 *  effect: Effect
 * }} ServiceParams
 */
/**
 * ServiceSetupParams - TODO: description
 * @typedef {{
 *  id: String,
 *  listenerCreator: Function
 * }} ServiceSetupParams
 */
/**
 * @callback Connect
 * @param {PluginService} service
 */
/**
 * @callback ServicesBuilder
 * @param {Connect} connect
 */

/**
 * @typedef {string} ServiceId
 */

// * @typedef {Object.<string, ServiceParams>} ServicesMapType

/**
 * @typedef {{ [id:string]: ServiceParams }} ServicesMapType
 */

/**
 *
 * @typedef {Object.<string, ServiceSetupParams>} ServicesSetups
 */

function setSliceId(sliceName, id) {
  return `${sliceName}/${id}`;
}

/**
 * getServicesSetups
 * @param {ServicesMapType} services
 * @param {string} sliceName
 * @returns {ServicesSetups}
 */
export function getServicesSetups(services, sliceName) {
  return Object.keys(services).reduce((acc, serviceId) => {
    return {
      ...acc,
      [serviceId]: {
        id: setSliceId(sliceName, serviceId),
        listenerCreator: () => {},
      },
    };
  }, {});
}

/**
 *
 * @param {ServicesMapType} services
 * @param {string} sliceName
 * @returns {PluginService[]}
 */
export function formatServicesToPlugin(services, sliceName) {
  return Object.keys(services).reduce(
    (acc, id) => [
      ...acc,
      {
        id: setSliceId(sliceName, id),
        action: services[id].onSetup,
        effect: services[id].effect,
      },
    ],
    []
  );
}

/**
 * createSliceServices is an interface for creating slice services.
 * @template {ServicesMapType} ServicesMap
 * @param {{
 *  name: String,
 *  services: ServicesMap
 * }} sliceServiceParams
 * @returns {{
 *  pluginServices: PluginService[],
 *  setups: { [id in keyof ServicesMap]: ServiceSetupParams }
 * }}
 */
export function createSliceServices({ name: sliceName, services }) {
  const pluginServices = formatServicesToPlugin(services, sliceName);
  const setups = getServicesSetups(services, sliceName);

  return { pluginServices, setups };
}
