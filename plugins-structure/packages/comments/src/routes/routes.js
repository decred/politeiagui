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
    path: "/comments/counts",
    fetch: async () => {
      await fetchPolicyIfIdle();
      validateCommentsCountsPageSize(store.getState());
    },
  },
  {
    path: "/comments/timestamps",
    fetch: async () => {
      await fetchPolicyIfIdle();
      validateCommentsTimestampsPageSize(store.getState());
    },
  },
  {
    path: "/comments/votes",
    fetch: async () => {
      await fetchPolicyIfIdle();
      validateCommentsVotesPageSize(store.getState());
    },
  },
];
