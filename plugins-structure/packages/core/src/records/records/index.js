import { fetchRecords, fetchRecordsNextPage, pushRecordsFetchQueue, setRecordsFetchQueue, popRecordsFetchQueue, selectRecordsStatus, selectRecordByToken, selectRecords,
  selectRecordsByStateAndStatus,
  selectRecordsFetchQueue,
  selectHasMoreRecordsToFetch } from "./recordsSlice";
import { useFetchRecords } from "./useFetchRecords";

export const records = {
  fetch: fetchRecords,
  fetchNextPage: fetchRecordsNextPage,
  pushFetchQueue: pushRecordsFetchQueue,
  setFetchQueue: setRecordsFetchQueue,
  popFetchQueue: popRecordsFetchQueue,
  selectStatus: selectRecordsStatus,
  selectByToken: selectRecordByToken,
  selectAll: selectRecords,
  selectByStateAndStatus: selectRecordsByStateAndStatus,
  selectFetchQueue: selectRecordsFetchQueue,
  selectHasMoreToFetch: selectHasMoreRecordsToFetch,
  useFetch: useFetchRecords
};