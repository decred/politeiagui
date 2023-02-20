import { createAction } from "@reduxjs/toolkit";

export const fetchInventory = createAction("proposals/fetchInventory");
export const fetchNextBatchCount = createAction(
  "proposals/fetchNextBatchCount"
);
export const fetchNextBatchSummaries = createAction(
  "proposals/fetchNextBatchSummaries"
);
export const fetchNextBatchRecords = createAction(
  "proposals/fetchNextBatchRecords"
);
export const fetchNextBatchBillingStatuses = createAction(
  "proposals/fetchNextBatchBillingStatuses"
);

export function fetchNextBatch({ status, recordsState, userid }) {
  const hasBillingStatus = status === "approved";
  return (dispatch) => {
    dispatch(fetchNextBatchCount({ status, recordsState, userid }));
    dispatch(fetchNextBatchSummaries({ status, recordsState, userid }));
    dispatch(fetchNextBatchRecords({ status, recordsState, userid }));
    hasBillingStatus &&
      dispatch(fetchNextBatchBillingStatuses({ status, recordsState, userid }));
  };
}
