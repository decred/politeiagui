import {
  selectRecordsPolicy,
  selectRecordsPolicyRule,
  selectRecordsPolicyStatus,
  selectRecordsPolicyError,
  fetchRecordsPolicy,
} from "./policySlice";
import { useFetchPolicy } from "./useFetchPolicy";

export const recordsPolicy = {
  select: selectRecordsPolicy,
  selectStatus: selectRecordsPolicyStatus,
  selectError: selectRecordsPolicyError,
  selectRule: selectRecordsPolicyRule,
  fetch: fetchRecordsPolicy,
  useFetch: useFetchPolicy,
};
