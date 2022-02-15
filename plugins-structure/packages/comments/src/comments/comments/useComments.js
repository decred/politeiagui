import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordComments } from "./";

export function useRecordComments({ token, id }) {
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
    if (commentsStatus === "idle") {
      onFetchComments();
    }
  }, [commentsStatus, onFetchComments]);

  return {
    comment,
    comments,
    commentsError,
    commentsStatus,
    onFetchComments,
  };
}
