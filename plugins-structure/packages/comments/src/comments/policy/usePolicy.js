import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentsPolicy } from "./";

export function useCommentsPolicy() {
  const dispatch = useDispatch();

  // Selectors
  const policy = useSelector(commentsPolicy.select);
  const policyStatus = useSelector(commentsPolicy.selectStatus);
  const policyError = useSelector(commentsPolicy.selectError);

  // Effects
  useEffect(() => {
    if (policyStatus === "idle") {
      dispatch(commentsPolicy.fetch());
    }
  }, [policyStatus, dispatch]);

  return {
    policy,
    policyError,
    policyStatus,
  };
}
