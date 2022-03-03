import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketvoteSubmissions } from "./";

export function useTicketvoteSubmissions({ token }) {
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
    if (submissionsStatus === "idle") {
      onFetchSubmissions();
    }
  }, [submissionsStatus, onFetchSubmissions]);

  return {
    submissions,
    submissionsError,
    submissionsStatus,
    onFetchSubmissions,
  };
}
