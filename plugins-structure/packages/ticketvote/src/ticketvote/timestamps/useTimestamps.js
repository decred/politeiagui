import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ticketvoteTimestamps } from "./";

export function useTicketvoteTimestamps({ token }) {
  const dispatch = useDispatch();

  // Selectors
  const timestamps = useSelector((state) =>
    ticketvoteTimestamps.selectByToken(state, token)
  );
  const timestampsStatus = useSelector(ticketvoteTimestamps.selectStatus);
  const timestampsError = useSelector(ticketvoteTimestamps.selectError);

  // Actions
  const onFetchTimestamps = useCallback(
    (page = 0) =>
      dispatch(ticketvoteTimestamps.fetch({ token, votesPage: page })),
    [dispatch, token]
  );

  // Effects
  useEffect(() => {
    if (timestampsStatus === "idle") {
      onFetchTimestamps();
    }
  }, [timestampsStatus, onFetchTimestamps]);

  return {
    timestamps,
    timestampsError,
    timestampsStatus,
    onFetchTimestamps,
  };
}
