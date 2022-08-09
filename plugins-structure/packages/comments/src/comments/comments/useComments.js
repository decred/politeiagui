import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordComments } from "./";

export function useRecordComments({ token }) {
  const dispatch = useDispatch();

  // Selectors
  const comments = useSelector((state) =>
    recordComments.selectByToken(state, token)
  );
  const commentsStatus = useSelector((state) =>
    recordComments.selectStatus(state)
  );
  const commentsError = useSelector((state) =>
    recordComments.selectError(state)
  );

  // Effects
  useEffect(() => {
    if (commentsStatus === "idle") {
      dispatch(recordComments.fetch({ token }));
    }
  }, [commentsStatus, token, dispatch]);

  return {
    comments,
    commentsError,
    commentsStatus,
  };
}
