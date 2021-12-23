import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commentsTimestamps } from "./";
import { checkReducersDeps } from "../helpers";

export function useCommentsTimestamps({ token, commentids = [] }) {
  const dispatch = useDispatch();
  checkReducersDeps(["commentsTimestamps"]);

  const [fetchedTimestamps, setFetchedTimestamps] = useState(commentids);
  const timestamps = useSelector((state) =>
    commentsTimestamps.selectByToken(state, token)
  );
  const timestampsStatus = useSelector(commentsTimestamps.selectStatus);
  const timestampsError = useSelector(commentsTimestamps.selectError);

  // Actions
  const onFetchTimestamps = useCallback(async () => {
    await dispatch(commentsTimestamps.fetch({ token, commentids }));
    setFetchedTimestamps([...fetchedTimestamps, ...commentids]);
  }, [dispatch, token, fetchedTimestamps, commentids]);

  return {
    timestamps,
    fetchedTimestamps,
    timestampsError,
    timestampsStatus,
    onFetchTimestamps,
  };
}
