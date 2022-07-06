import { ticketvote } from "./";
import { store } from "@politeiagui/core";

export function fetchPolicyIfIdle() {
  if (ticketvote.policy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(ticketvote.policy.fetch());
  }
}
