import { useRef, useEffect, useState } from "react";

const DEFAULT_ARGS = [];

function useApplyAction(action, args = DEFAULT_ARGS, enabled = true) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState(null);
  useEffect(() => {
    let mounted = true;
    async function executeAction() {
      if (mounted) setLoading(true);
      try {
        const res = await action.apply(null, args);
        if (mounted) {
          setLoading(false);
          setResponse(res);
        }
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    }
    if (enabled) {
      executeAction();
    }
    return function cleanup() {
      mounted = false;
    };
  }, [action, args, enabled]);
  return [loading, error, response];
}

function areArgsEqual(newArgs, oldArgs) {
  if (newArgs.length !== oldArgs.length) {
    return false;
  }
  const shallowEqual = (a, b) => a === b;
  return newArgs.every((newArg, index) => shallowEqual(newArg, oldArgs[index]));
}

/**
 * useAPIAction hook memoizes the args array and applies the action if enabled. args should be an array of primitives.
 * @param {function} action
 * @param {array} args
 * @param {boolean} enabled
 */
function useAPIAction(action, args = DEFAULT_ARGS, enabled = true) {
  const actionArgs = useRef(args);
  const areArgsMatched =
    args && actionArgs.current && areArgsEqual(args, actionArgs.current);
  const cachedArgs = areArgsMatched ? actionArgs.current : args;

  useEffect(() => {
    actionArgs.current = cachedArgs;
  }, [cachedArgs]);

  return useApplyAction(action, cachedArgs, enabled);
}

export default useAPIAction;
