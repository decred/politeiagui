import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ticketvotePolicy } from "./";

export function useTicketvotePolicy() {
  const dispatch = useDispatch();

  // Selectors
  const policy = useSelector(ticketvotePolicy.select);
  const policyStatus = useSelector(ticketvotePolicy.selectStatus);
  const policyError = useSelector(ticketvotePolicy.selectError);

  // Effects
  useEffect(() => {
    if (policyStatus === "idle") {
      dispatch(ticketvotePolicy.fetch());
    }
  }, [policyStatus, dispatch]);

  return {
    policy,
    policyError,
    policyStatus,
  };
}
