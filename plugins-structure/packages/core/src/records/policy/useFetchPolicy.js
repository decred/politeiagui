import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordsPolicy } from "./";

export function useFetchRecordsPolicy() {
  const dispatch = useDispatch();

  // Selectors
  const policy = useSelector(recordsPolicy.select);
  const policyStatus = useSelector(recordsPolicy.selectStatus);
  const policyError = useSelector(recordsPolicy.selectError);

  // Effects
  useEffect(() => {
    if (policyStatus === "idle") {
      dispatch(recordsPolicy.fetch());
    }
  }, [policyStatus, dispatch]);

  return {
    policy,
    policyError,
    policyStatus,
  };
}
