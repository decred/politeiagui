import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentsCount } from "./";

export function useCommentsCount({ tokens }) {
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
    if (countStatus === "idle") {
      console.log("chamou", countStatus);
      onFetchCount();
    }
  }, [countStatus, onFetchCount]);

  console.log(tokens);
  return {
    count,
    countStatus,
    countError,
    onFetchCount,
  };
}
