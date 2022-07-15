import { createAction } from "@reduxjs/toolkit";

export const fetchNextBatchCount = createAction("home/fetchNextBatchCount");
export const fetchNextBatchSummaries = createAction(
  "home/fetchNextBatchSummaries"
);
export const fetchNextBatchRecords = createAction("home/fetchNextBatchRecords");

export function fetchNextBatch(payload) {
  return (dispatch) => {
    dispatch(fetchNextBatchCount(payload));
    dispatch(fetchNextBatchSummaries(payload));
    dispatch(fetchNextBatchRecords(payload));
  };
}
