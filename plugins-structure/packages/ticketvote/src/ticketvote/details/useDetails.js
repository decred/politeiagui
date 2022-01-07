import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ticketvoteDetails } from "./";

export function useTicketvoteDetails({ token, initialFetch = false }) {
  const dispatch = useDispatch();

  // Vote Details
  const details = useSelector((state) =>
    ticketvoteDetails.selectByToken(state, token)
  );
  const detailsStatus = useSelector((state) =>
    ticketvoteDetails.selectStatus(state)
  );
  const detailsError = useSelector((state) =>
    ticketvoteDetails.selectError(state)
  );

  // Actions
  const onFetchDetails = useCallback(
    () => dispatch(ticketvoteDetails.fetch({ token })),
    [token, dispatch]
  );

  // Effects
  useEffect(() => {
    if (detailsStatus === "idle" && initialFetch) {
      onFetchDetails();
    }
  }, [detailsStatus, onFetchDetails, initialFetch]);

  return {
    details,
    detailsError,
    detailsStatus,
    onFetchDetails,
  };
}
