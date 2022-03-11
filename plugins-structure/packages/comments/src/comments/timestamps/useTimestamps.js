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
  // onFetchTimestamps fetches all timestamps given commentids list hook param.
  const onFetchTimestamps = useCallback(async () => {
    // get paginated commentids without timestamps fetched
    const timestampsToFetch = difference(commentids)(fetchedTimestamps);
    const [currentPage] = chunk(pageSize)(timestampsToFetch);
    // avoid fetching repeated timestamps before fetching, in order to avoid
    // repeated requests once fetch is done.
    setFetchedTimestamps([...fetchedTimestamps, ...currentPage]);
    try {
      await dispatch(
        commentsTimestamps.fetch({ token, commentids: currentPage, pageSize })
      );
    } catch (e) {
      // in case of error, remove target timestamps page from fetched timestamps
      // list.
      setFetchedTimestamps(fetchedTimestamps);
    }
  }, [dispatch, token, commentids, pageSize, fetchedTimestamps]);

  useEffect(() => {
    // fetch timestamps if there are remaining timestamps.
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
