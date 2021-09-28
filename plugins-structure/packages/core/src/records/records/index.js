import {
  fetchRecords,
  fetchRecordsNextPage,
  pushFetchQueue,
  setFetchQueue,
  popFetchQueue,
  selectRecordsStatus,
  selectRecordByToken,
  selectRecords,
  selectRecordsByStateAndStatus,
  selectRecordsFetchQueue,
  selectHasMoreRecordsToFetch,
} from "./recordsSlice";
import { useFetchRecords } from "./useFetchRecords";

export const records = {
  fetch: fetchRecords,
  fetchNextPage: fetchRecordsNextPage,
  pushFetchQueue,
  setFetchQueue,
  popFetchQueue,
  selectStatus: selectRecordsStatus,
  selectByToken: selectRecordByToken,
  selectAll: selectRecords,
  selectByStateAndStatus: selectRecordsByStateAndStatus,
  selectFetchQueue: selectRecordsFetchQueue,
  selectHasMoreToFetch: selectHasMoreRecordsToFetch,
  useFetch: useFetchRecords,
};
