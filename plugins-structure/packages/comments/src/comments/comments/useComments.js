import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { recordComments } from "./";

export function useRecordComments({ token, id, initialFetch = false }) {
  const dispatch = useDispatch();

  // Selectors
  const comments = useSelector((state) =>
    recordComments.selectByToken(state, token)
  );
  const comment = useSelector((state) =>
    recordComments.selectById(state, { token, id })
  );
  const commentsStatus = useSelector((state) =>
    recordComments.selectStatus(state)
  );
  const commentsError = useSelector((state) =>
    recordComments.selectError(state)
  );

  // Actions
  const onFetchComments = useCallback(
    () => dispatch(recordComments.fetch({ token })),
    [token, dispatch]
  );

  // Effects
  useEffect(() => {
    if (commentsStatus === "idle" && initialFetch) {
      onFetchComments();
    }
  }, [commentsStatus, onFetchComments, initialFetch]);

  return {
    comment,
    comments,
    commentsError,
    commentsStatus,
    onFetchComments,
  };
}
