import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commentsPolicy } from "./";

export function useCommentsPolicy({ initialFetch = false }) {
  const dispatch = useDispatch();

  // Selectors
  const policy = useSelector(commentsPolicy.select);
  const policyStatus = useSelector(commentsPolicy.selectStatus);
  const policyError = useSelector(commentsPolicy.selectError);

  // Actions
  const onFetchPolicy = useCallback(
    () => dispatch(commentsPolicy.fetch()),
    [dispatch]
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
