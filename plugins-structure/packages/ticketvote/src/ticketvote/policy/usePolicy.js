import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ticketvotePolicy } from "./";

export function useTicketvotePolicy({ token, initialFetch = false }) {
  const dispatch = useDispatch();

  // Selectors
  const policy = useSelector((state) =>
    ticketvotePolicy.selectByToken(state, token)
  );
  const policyStatus = useSelector((state) =>
    ticketvotePolicy.selectStatus(state)
  );
  const policyError = useSelector((state) =>
    ticketvotePolicy.selectError(state)
  );

  // Actions
  const onFetchPolicy = useCallback(
    () => dispatch(ticketvotePolicy.fetch({ token })),
    [token, dispatch]
  );

  // Effects
  useEffect(() => {
    if (policyStatus === "idle" && initialFetch) {
      onFetchPolicy();
    }
  }, [policyStatus, onFetchPolicy, initialFetch]);

  return {
    policy,
    policyError,
    policyStatus,
    onFetchPolicy,
  };
}
