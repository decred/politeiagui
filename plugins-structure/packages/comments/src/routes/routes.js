import { store } from "@politeiagui/core";
import { comments } from "../comments";
import {
  validateCommentsCountsPageSize,
  validateCommentsTimestampsPageSize,
  validateCommentsVotesPageSize,
} from "../lib/validation";

function fetchPolicyIfIdle() {
  if (comments.policy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(comments.policy.fetch());
  }
}

export const routes = [
  {
    path: "/comments",
    fetch: async () => {
      await fetchPolicyIfIdle();
      validateCommentsCountsPageSize(store.getState());
    },
  },
  {
    path: "/comments/details",
    fetch: async () => {
      await fetchPolicyIfIdle();
      validateCommentsTimestampsPageSize(store.getState());
      validateCommentsVotesPageSize(store.getState());
    },
  },
];
