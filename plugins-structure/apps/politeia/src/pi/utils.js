import { store } from "@politeiagui/core";
import { piPolicy } from "./policy";

export function fetchPolicyIfIdle() {
  if (piPolicy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(piPolicy.fetch());
  }
}
