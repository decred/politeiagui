import {
  fetchRecordDetails,
  fetchRecords,
  selectRecordByToken,
  selectRecords,
  selectRecordsByStateAndStatus,
  selectRecordsByTokensBatch,
  selectRecordsStatus,
} from "./recordsSlice";

export const records = {
  fetch: fetchRecords,
  fetchDetails: fetchRecordDetails,
  selectStatus: selectRecordsStatus,
  selectByToken: selectRecordByToken,
  selectByTokensBatch: selectRecordsByTokensBatch,
  selectAll: selectRecords,
  selectByStateAndStatus: selectRecordsByStateAndStatus,
};
