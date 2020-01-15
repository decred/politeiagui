import { useEffect, useState } from "react";

const DEFAULT_ARGS = [];

function useAPIAction(action, args = DEFAULT_ARGS, enabled = true) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState(null);
  useEffect(() => {
    async function executeAction() {
      setLoading(true);
      try {
        const res = await action.apply(null, args);
        setLoading(false);
        setResponse(res);
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    }
    if (enabled) {
      executeAction();
    }
  }, [action, args, enabled]);
  return [loading, error, response];
}

export default useAPIAction;
