import {
  fetchRecordDetails,
  fetchRecords,
  selectRecordByToken,
  selectRecords,
  selectRecordsByStateAndStatus,
  selectRecordsByTokensBatch,
  selectRecordsError,
  selectRecordsStatus,
} from "./recordsSlice";

export const records = {
  fetch: fetchRecords,
  fetchDetails: fetchRecordDetails,
  selectStatus: selectRecordsStatus,
  selectError: selectRecordsError,
  selectByToken: selectRecordByToken,
  selectByTokensBatch: selectRecordsByTokensBatch,
  selectAll: selectRecords,
  selectByStateAndStatus: selectRecordsByStateAndStatus,
};
