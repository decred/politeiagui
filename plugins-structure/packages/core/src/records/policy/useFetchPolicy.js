import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { recordsPolicy } from "./";

export function useFetchPolicy() {
  const dispatch = useDispatch();

  // Selectors
  const policy = useSelector(recordsPolicy.select);
  const policyStatus = useSelector(recordsPolicy.selectStatus);
  const policyError = useSelector(recordsPolicy.selectError);

  console.log(policyStatus);

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
