import {
  fetchCommentsPolicy,
  selectCommentsPolicy,
  selectCommentsPolicyError,
  selectCommentsPolicyRule,
  selectCommentsPolicyStatus,
} from "./policySlice";

export const commentsPolicy = {
  fetch: fetchCommentsPolicy,
  select: selectCommentsPolicy,
  selectStatus: selectCommentsPolicyStatus,
  selectRule: selectCommentsPolicyRule,
  selectError: selectCommentsPolicyError,
};
