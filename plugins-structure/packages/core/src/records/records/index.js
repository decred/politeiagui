import {
  fetchRecordDetails,
  fetchRecordVersionDetails,
  fetchRecords,
  selectFullToken,
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
  selectFullToken: selectFullToken,
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
