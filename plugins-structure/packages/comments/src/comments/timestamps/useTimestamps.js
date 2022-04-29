import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentsTimestamps } from "./";
import { recordComments } from "../comments";
import { commentsPolicy } from "../policy";
import chunk from "lodash/fp/chunk";
import difference from "lodash/fp/difference";

export function useCommentsTimestamps({ token, commentids }) {
  const dispatch = useDispatch();

  const [fetchedTimestamps, setFetchedTimestamps] = useState([]);
  const timestamps = useSelector((state) =>
    commentsTimestamps.selectByToken(state, token)
  );
  const timestampsStatus = useSelector(commentsTimestamps.selectStatus);
  const timestampsError = useSelector(commentsTimestamps.selectError);
  const pageSize = useSelector((state) =>
    commentsPolicy.selectRule(state, "timestampspagesize")
  );

  const loadedIds = useSelector((state) =>
    recordComments.selectIds(state, token)
  );
  const ids = commentids || loadedIds;

  // Actions
  // onFetchTimestamps fetches all timestamps given ids list hook param.
  const onFetchTimestamps = useCallback(async () => {
    // get paginated ids without timestamps fetched
    const timestampsToFetch = difference(ids)(fetchedTimestamps);
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
  }, [dispatch, token, ids, pageSize, fetchedTimestamps]);

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
