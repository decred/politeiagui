import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commentsCount } from "./";

export function useCommentsCount({ tokens, initialFetch = false }) {
  const dispatch = useDispatch();

  // Selectors
  const count = useSelector(commentsCount.selectAll);
  const countStatus = useSelector(commentsCount.selectStatus);
  const countError = useSelector(commentsCount.selectError);

  // Actions
  const onFetchCount = useCallback(
    () => dispatch(commentsCount.fetch({ tokens })),
    [dispatch, tokens]
  );

  // Effects
  useEffect(() => {
    if (countStatus === "idle" && initialFetch) {
      console.log("vai dar fetch");
      onFetchCount();
    }
  }, [countStatus, onFetchCount, initialFetch]);

  return {
    count,
    countStatus,
    countError,
    onFetchCount,
  };
}
