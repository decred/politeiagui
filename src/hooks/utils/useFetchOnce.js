import useFetchMachine, { FETCH, RESOLVE, REJECT } from "./useFetchMachine";

const DEFAULT_ARGS = [];

/**
 * useFetchOnce hook uses the fetch machine to control loading and error states for
 * given action(args) if enabled.
 * @param {function} action
 * @param {array} args
 * @param {boolean} enabled
 */
function useFetchOnce(action, args = DEFAULT_ARGS, enabled = true) {
  const [state, send] = useFetchMachine({
    actions: {
      initial: () => {
        if (!enabled) return;
        action(...(args || []))
          .then(() => send(RESOLVE))
          .catch((e) => send(REJECT, { error: e }));
        return send(FETCH);
      }
    }
  });
  return [state.loading, state.error];
}

export default useFetchOnce;
