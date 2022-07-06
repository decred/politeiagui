import { comments } from "../comments";
import { store } from "@politeiagui/core";

export function fetchPolicyIfIdle() {
  if (comments.policy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(comments.policy.fetch());
  }
}
