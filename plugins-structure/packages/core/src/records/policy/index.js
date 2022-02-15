import {
  fetchRecordsPolicy,
  selectRecordsPolicy,
  selectRecordsPolicyError,
  selectRecordsPolicyRule,
  selectRecordsPolicyStatus,
} from "./policySlice";
import { useFetchRecordsPolicy } from "./useFetchPolicy";

export const recordsPolicy = {
  select: selectRecordsPolicy,
  selectStatus: selectRecordsPolicyStatus,
  selectError: selectRecordsPolicyError,
  selectRule: selectRecordsPolicyRule,
  fetch: fetchRecordsPolicy,
  useFetch: useFetchRecordsPolicy,
};
