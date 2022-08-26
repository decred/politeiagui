import {
  fetchRecordsPolicy,
  selectRecordsPolicy,
  selectRecordsPolicyError,
  selectRecordsPolicyRule,
  selectRecordsPolicyStatus,
} from "./policySlice";

export const recordsPolicy = {
  select: selectRecordsPolicy,
  selectStatus: selectRecordsPolicyStatus,
  selectError: selectRecordsPolicyError,
  selectRule: selectRecordsPolicyRule,
  fetch: fetchRecordsPolicy,
};
