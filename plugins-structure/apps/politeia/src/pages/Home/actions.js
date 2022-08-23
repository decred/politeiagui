import { createAction } from "@reduxjs/toolkit";

export const fetchInventory = createAction("home/fetchInventory");
export const fetchNextBatchCount = createAction("home/fetchNextBatchCount");
export const fetchNextBatchSummaries = createAction(
  "home/fetchNextBatchSummaries"
);
export const fetchNextBatchRecords = createAction("home/fetchNextBatchRecords");
export const fetchNextBatchBillingStatuses = createAction(
  "home/fetchNextBatchBillingStatuses"
);

export function fetchNextBatch(status) {
  const hasBillingStatus = status === "approved";
  return (dispatch) => {
    dispatch(fetchNextBatchCount(status));
    dispatch(fetchNextBatchSummaries(status));
    dispatch(fetchNextBatchRecords(status));
    hasBillingStatus && dispatch(fetchNextBatchBillingStatuses(status));
  };
}
