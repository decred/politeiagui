import { store } from "@politeiagui/core";
import { comments } from "../comments";

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
    },
  },
  {
    id: "comments/timestamps",
    action: async () => {
      await fetchPolicyIfIdle();
    },
  },
  {
    id: "comments/votes",
    action: async () => {
      await fetchPolicyIfIdle();
    },
  },
];
