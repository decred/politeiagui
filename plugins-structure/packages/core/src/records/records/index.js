import {
  fetchRecords,
  selectRecordsStatus,
  selectRecordByToken,
  selectRecords,
  selectRecordsByStateAndStatus,
  selectRecordsByTokensBatch,
} from "./recordsSlice";
import { useFetchRecords } from "./useFetchRecords";

export const records = {
  fetch: fetchRecords,
  selectStatus: selectRecordsStatus,
  selectByToken: selectRecordByToken,
  selectByTokensBatch: selectRecordsByTokensBatch,
  selectAll: selectRecords,
  selectByStateAndStatus: selectRecordsByStateAndStatus,
  useFetch: useFetchRecords,
};
