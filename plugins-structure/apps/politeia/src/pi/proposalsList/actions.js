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

export function fetchNextBatch({ status, recordsState }) {
  const hasBillingStatus = status === "approved";
  return (dispatch) => {
    dispatch(fetchNextBatchCount({ status, recordsState }));
    dispatch(fetchNextBatchSummaries({ status, recordsState }));
    dispatch(fetchNextBatchRecords({ status, recordsState }));
    hasBillingStatus &&
      dispatch(fetchNextBatchBillingStatuses({ status, recordsState }));
  };
}
