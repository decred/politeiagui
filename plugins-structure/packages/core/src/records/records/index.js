import {
  fetchRecordDetails,
  fetchRecords,
  selectFullToken,
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
  selectFullToken: selectFullToken,
  selectStatus: selectRecordsStatus,
  selectError: selectRecordsError,
  selectByToken: selectRecordByToken,
  selectByTokensBatch: selectRecordsByTokensBatch,
  selectAll: selectRecords,
  selectByStateAndStatus: selectRecordsByStateAndStatus,
};
