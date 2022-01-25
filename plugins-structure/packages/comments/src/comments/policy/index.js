import {
  fetchCommentsPolicy,
  selectCommentsPolicy,
  selectCommentsPolicyRule,
  selectCommentsPolicyStatus,
  selectCommentsPolicyError,
} from "./policySlice";
import { useCommentsPolicy } from "./usePolicy";

export const commentsPolicy = {
  fetch: fetchCommentsPolicy,
  select: selectCommentsPolicy,
  selectStatus: selectCommentsPolicyStatus,
  selectRule: selectCommentsPolicyRule,
  selectError: selectCommentsPolicyError,
  useFetch: useCommentsPolicy,
};
