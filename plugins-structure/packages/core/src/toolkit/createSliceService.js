import curry from "lodash/fp/curry";
/**
 * PluginService is an `action` that will setup the plugin for usage in some given
 * `id` case.
 * @typedef {{
 *  id: string,
 *  action: Function,
 *  effect: Function
 * }} PluginService
 */
/**
 * @typedef {{
 *  actionCreator?: string,
 *  type?: string,
 *  matcher?: Function
 * }} ListenerMatch
 */
/**
 * @typedef {ListenerMatch & {injectEffect: onCustomizeListenerEffect}} ListenerCreator
 */
/**
 * @callback ListenerEffect
 * @param {Object} state
 * @param {import("@reduxjs/toolkit").Dispatch} dispatch
 * @param {Object} effectPayload
 */
/**
 * @callback CurriedListenerEffect
 * @param {ListenerEffect} effect
 * @param {import("@reduxjs/toolkit").PayloadAction} action
 * @param {import("@reduxjs/toolkit").ListenerEffectAPI} listenerApi
 */
/**
 * @callback onCustomizeListenerEffect
 * @param {CurriedListenerEffect} curriedEffectListerner
 */
/**
 * ServiceParams - TODO: description
 * @typedef {{
 *  onSetup?: Function,
 *  effect?: ListenerEffect
 * }} ServiceParams
 */
/**
 * @typedef {{
 *  id: string,
 *  listenerCreator: ListenerCreator
 *  customizeEffect: onCustomizeListenerEffect
 * }} ServiceListener
 */
/**
 * ServiceSetupParams - TODO: description
 * @typedef {{
 *  id: String,
 *  listenTo: onServiceListener
 * }} ServiceSetupParams
 */
/**
 * @typedef {{ [id:string]: ServiceParams }} ServicesMapType
 */
/**
 * @callback onServiceListener
 * @param {ListenerMatch} params
 * @returns {ServiceListener}
 */

/**
 * setSliceId
 * @param {string} sliceName
 * @param {string} id
 * @returns {string} `${sliceName}/${id}`
 */
function setSliceId(sliceName, id) {
  return `${sliceName}/${id}`;
}

/**
 * @type {CurriedListenerEffect}
 */
function defaultInjectEffect(effect, action, { getState, dispatch }) {
  effect(getState(), dispatch, action);
}

/**
 * createServiceListener
 * @param {string} id
 * @return {onServiceListener}
 */
const createServiceListener =
  (id) =>
  ({ actionCreator, type, matcher }) => {
    return {
      id,
      listenerCreator: {
        actionCreator,
        type,
        matcher,
        injectEffect: curry(defaultInjectEffect),
      },
      customizeEffect: (injectEffect) => ({
        listenerCreator: {
          type,
          actionCreator,
          matcher,
          injectEffect: curry(injectEffect),
        },
        id,
      }),
    };
  };

/**
 * getServicesSetups
 * @template {ServicesMapType} ServicesMap
 * @param {ServicesMap} services
 * @param {string} sliceName
 * @returns {{[serviceId in keyof ServicesMap]: ServiceSetupParams }}
 */
export function getServicesSetups(services, sliceName) {
  return Object.keys(services).reduce((acc, serviceId) => {
    const id = setSliceId(sliceName, serviceId);
    return {
      ...acc,
      [serviceId]: {
        id,
        listenTo: createServiceListener(id),
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
 *  setups: { [serviceId in keyof ServicesMap]: ServiceSetupParams }
 * }}
 */
export function createSliceServices({ name: sliceName, services }) {
  const pluginServices = formatServicesToPlugin(services, sliceName);
  const setups = getServicesSetups(services, sliceName);

  return { pluginServices, setups };
}
