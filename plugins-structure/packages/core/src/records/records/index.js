import {
  fetchRecordDetails,
  fetchRecordVersionDetails,
  fetchRecords,
  selectRecordByToken,
  selectRecordVersionByToken,
  selectRecordVersionStatusByToken,
  selectRecords,
  selectRecordsByStateAndStatus,
  selectRecordsByTokensBatch,
  selectRecordsError,
  selectRecordsStatus,
} from "./recordsSlice";

export const records = {
  fetch: fetchRecords,
  fetchDetails: fetchRecordDetails,
  fetchVersionDetails: fetchRecordVersionDetails,
  selectStatus: selectRecordsStatus,
  selectError: selectRecordsError,
  selectByToken: selectRecordByToken,
  selectVersionByToken: selectRecordVersionByToken,
  selectVersionStatusByToken: selectRecordVersionStatusByToken,
  selectByTokensBatch: selectRecordsByTokensBatch,
  selectAll: selectRecords,
  selectByStateAndStatus: selectRecordsByStateAndStatus,
};
