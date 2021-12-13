import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commentsComments } from "./";

export function useRecordComments({ token, id, initialFetch = false }) {
  const dispatch = useDispatch();

  // Selectors
  const comments = useSelector((state) =>
    commentsComments.selectByToken(state, token)
  );
  const comment = useSelector((state) =>
    commentsComments.selectById(state, { token, id })
  );
  const commentsStatus = useSelector((state) =>
    commentsComments.selectStatus(state)
  );
  const commentsError = useSelector((state) =>
    commentsComments.selectError(state)
  );

  // Actions
  const onFetchComments = useCallback(
    () => dispatch(commentsComments.fetch({ token })),
    [token, dispatch]
  );

  // Effects
  useEffect(() => {
    if (commentsStatus === "idle" && initialFetch) {
      onFetchComments();
    }
  }, [commentsStatus, onFetchComments, initialFetch]);

  return {
    comments,
    commentsError,
    commentsStatus,
    onFetchComments,
  };
}
