import {
  fetchCommentsPolicy,
  selectCommentsPolicy,
  selectCommentsPolicyRule,
  selectCommentsPolicyStatus,
  selectCommentsPolicyError,
} from "./policySlice";

export const commentsPolicy = {
  fetch: fetchCommentsPolicy,
  select: selectCommentsPolicy,
  selectStatus: selectCommentsPolicyStatus,
  selectRule: selectCommentsPolicyRule,
  selectError: selectCommentsPolicyError,
};
