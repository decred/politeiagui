import { apiPolicy } from "../api";
import { store } from "../storeSetup";

export function fetchPolicyIfIdle() {
  if (apiPolicy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(apiPolicy.fetch());
  }
}
