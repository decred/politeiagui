import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ticketvoteSubmissions } from "./";

export function useTicketvoteSubmissions({ token, initialFetch = false }) {
  const dispatch = useDispatch();

  // Selectors
  const submissions = useSelector((state) =>
    ticketvoteSubmissions.selectByToken(state, token)
  );
  const submissionsStatus = useSelector((state) =>
    ticketvoteSubmissions.selectStatus(state)
  );
  const submissionsError = useSelector((state) =>
    ticketvoteSubmissions.selectError(state)
  );

  // Actions
  const onFetchSubmissions = useCallback(
    () => dispatch(ticketvoteSubmissions.fetch({ token })),
    [token, dispatch]
  );

  // Effects
  useEffect(() => {
    if (submissionsStatus === "idle" && initialFetch) {
      onFetchSubmissions();
    }
  }, [submissionsStatus, onFetchSubmissions, initialFetch]);

  return {
    submissions,
    submissionsError,
    submissionsStatus,
    onFetchSubmissions,
  };
}
