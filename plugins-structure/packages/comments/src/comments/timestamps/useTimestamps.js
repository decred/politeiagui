import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentsTimestamps } from "./";
import chunk from "lodash/fp/chunk";
import difference from "lodash/fp/difference";

export function useCommentsTimestamps({ token, commentids = [], pageSize }) {
  const dispatch = useDispatch();

  const [fetchedTimestamps, setFetchedTimestamps] = useState([]);
  const timestamps = useSelector((state) =>
    commentsTimestamps.selectByToken(state, token)
  );
  const timestampsStatus = useSelector(commentsTimestamps.selectStatus);
  const timestampsError = useSelector(commentsTimestamps.selectError);

  // Actions
  const onFetchTimestamps = useCallback(async () => {
    const timestampsToFetch = difference(commentids)(fetchedTimestamps);
    const [currentPage] = chunk(pageSize)(timestampsToFetch);
    setFetchedTimestamps([...fetchedTimestamps, ...currentPage]);
    try {
      await dispatch(
        commentsTimestamps.fetch({ token, commentids: currentPage, pageSize })
      );
    } catch (e) {
      setFetchedTimestamps(fetchedTimestamps);
    }
  }, [dispatch, token, commentids, pageSize, fetchedTimestamps]);

  useEffect(() => {
    if (timestampsStatus === "succeeded/hasMore") {
      onFetchTimestamps();
    }
  }, [timestampsStatus, onFetchTimestamps]);

  return {
    timestamps,
    fetchedTimestamps,
    timestampsError,
    timestampsStatus,
    onFetchTimestamps,
  };
}
