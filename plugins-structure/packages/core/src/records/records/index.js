import {
  fetchRecords,
  selectRecordsStatus,
  selectRecordByToken,
  selectRecords,
  selectRecordsByStateAndStatus,
  selectRecordsByTokensBatch,
} from "./recordsSlice";

export const records = {
  fetch: fetchRecords,
  selectStatus: selectRecordsStatus,
  selectByToken: selectRecordByToken,
  selectByTokensBatch: selectRecordsByTokensBatch,
  selectAll: selectRecords,
  selectByStateAndStatus: selectRecordsByStateAndStatus,
};
