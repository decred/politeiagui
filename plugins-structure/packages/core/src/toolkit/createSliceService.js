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
 * @param {Service} service
 */
/**
 * @callback ServicesBuilder
 * @param {Connect} connect
 */

/**
 * @typedef {Object.<string, ServiceParams>} ServicesDictionary
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
 * @param {ServicesDictionary} services
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
 * @param {ServicesDictionary} services
 * @param {string} sliceName
 * @returns {Service[]}
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
 * @template {ServicesDictionary} sd
 * @param {{
 *  name: String,
 *  services: sd
 * }} sliceServiceParams
 * @returns {{
 *  pluginServices: Service[],
 *  setups: ServicesSetups,
 *  services: sd
 * }}
 */
export function createSliceServices({ name: sliceName, services }) {
  const pluginServices = formatServicesToPlugin(services, sliceName);
  const setups = getServicesSetups(services, sliceName);

  console.log("createSliceServices", { setups });

  return { pluginServices, setups, services };
}
