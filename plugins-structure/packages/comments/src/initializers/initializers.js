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

export const initializers = [
  {
    id: "comments/counts",
    action: async () => {
      await fetchPolicyIfIdle();
      validateCommentsCountsPageSize(store.getState());
    },
  },
  {
    id: "comments/timestamps",
    action: async () => {
      await fetchPolicyIfIdle();
      validateCommentsTimestampsPageSize(store.getState());
    },
  },
  {
    id: "comments/votes",
    action: async () => {
      await fetchPolicyIfIdle();
      validateCommentsVotesPageSize(store.getState());
    },
  },
];
