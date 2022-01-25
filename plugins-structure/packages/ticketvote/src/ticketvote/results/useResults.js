import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ticketvoteResults } from "./";

export function useTicketvoteResults({ token }) {
  const dispatch = useDispatch();

  // Vote Results
  const results = useSelector((state) =>
    ticketvoteResults.selectByToken(state, token)
  );
  const resultsStatus = useSelector(ticketvoteResults.selectStatus);
  const resultsError = useSelector(ticketvoteResults.selectError);

  // Actions
  const onFetchResults = useCallback(
    () => dispatch(ticketvoteResults.fetch({ token })),
    [token, dispatch]
  );

  // Effects
  useEffect(() => {
    if (resultsStatus === "idle") {
      onFetchResults();
    }
  }, [resultsStatus, onFetchResults]);

  return {
    results,
    resultsError,
    resultsStatus,
    onFetchResults,
  };
}
