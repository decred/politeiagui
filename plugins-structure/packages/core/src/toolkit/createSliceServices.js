import { store } from "../storeSetup";
import curry from "lodash/fp/curry";
import { validateSliceServices } from "./validation";
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
 * @callback ServiceOnSetup
 * @param {{
 *  getState: Function,
 *  dispatch: import("@reduxjs/toolkit").Dispatch
 * }}
 */
/**
 * @typedef {{
 *  onSetup?: ServiceOnSetup,
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
 * @type createServiceListener
 * @param {string} id
 * @return {onServiceListener}
 */
function createServiceListener(id) {
  return function serviceListener({ actionCreator, type, matcher }) {
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
}

/**
 * getServicesSetups returns a services setup map, where each setup can declare
 * a ServiceListener to some Redux Action.
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
 * formatServicesToPlugin returns an array of plugin services, which is used to
 * connect to some plugin setup.
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
        action: services[id].onSetup
          ? () =>
              services[id].onSetup({
                getState: store.getState,
                dispatch: store.dispatch,
              })
          : null,
        effect: services[id].effect,
      },
    ],
    []
  );
}

/**
 * createSliceServices is an interface for creating slice services.
 *
 * Each service is composed by an `id`, used to identify the service among our
 * plugins and apps, an `onSetup` function to be executed when our service is
 * setup, and an `effect` that will be executed for each Service Listener.
 *
 * Example:
 * ```javascript
 * import { pluginSetup } from "@politeiagui/core";
 * import { createSliceServices } from "@politeiagui/core/toolkit";
 * import { createAction } from "@reduxjs/toolkit";
 *
 * const services = createSliceServices({
 *   name: "my/test",
 *   services: {
 *     // `foo` is the service id
 *     foo: {
 *       effect: async (state, dispatch, payload) => {
 *         // Do something here to be executed on listener match
 *       },
 *       onSetup: () => {
 *         // Do something here to be executed when listener is initialized
 *       },
 *     },
 *   },
 * });
 *
 * // Action to listen to.
 * const myAction = createAction("myAction")
 *
 * const { foo } = services.setup;
 *
 * // setup foo without listeners. This return the serviceId, and once it's
 * // connected to our app, the `onSetup` action will be executed.
 * const fooWithoutListeners = foo;
 *
 * // setup foo without any effect customization. This will execute the effect
 * // using the listened action payload as argument. Works for any Redux Toolkit
 * // listener action matcher.
 * const fooWithoutEffectCustomizationType = foo.listenTo({ type: "myAction" });
 * // or
 * const fooWithoutEffectCustomizationActionCreator = foo.listenTo({
 *   actionCreator: myAction
 * });
 *
 * // setup foo with custom effect. This allows service's effect parameters
 * // customization, as well as the addition of a new listener handler.
 * const fooCustomized = foo
 *   .listenTo({ type: "myAction" })
 *   .customizeEffect((effect, { payload }, { dispatch, getState }) => {
 *     effect(getState(), dispatch, { token: payload });
 *   });
 *
 * // Use on plugin
 * const plugin = pluginSetup({
 *   name: "playground",
 *   reducers: [],
 *   services: services.pluginServices
 * })
 * ```
 *
 * @template {ServicesMapType} ServicesMap
 * @param {{
 *  name: String,
 *  services: ServicesMap
 * }} sliceServiceParams
 * @returns {{
 *  pluginServices: PluginService[],
 *  serviceSetups: { [serviceId in keyof ServicesMap]: ServiceSetupParams }
 * }}
 */
export function createSliceServices({ name: sliceName, services }) {
  validateSliceServices({ name: sliceName, services });
  const pluginServices = formatServicesToPlugin(services, sliceName);
  const serviceSetups = getServicesSetups(services, sliceName);

  return { pluginServices, serviceSetups };
}