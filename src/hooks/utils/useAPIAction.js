import { useEffect, useState } from "react";

const DEFAULT_ARGS = [];

function useAPIAction(action, args = DEFAULT_ARGS, enabled = true) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fired, setFired] = useState(false);
  useEffect(() => {
    async function executeAction() {
      setLoading(true);
      try {
        await action.apply(null, args);
        setLoading(false);
        setFired(true);
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    }
    if (enabled) {
      executeAction();
    }
  }, [action, args, enabled]);
  return [loading, error, fired];
}

export default useAPIAction;
