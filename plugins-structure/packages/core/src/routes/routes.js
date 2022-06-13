import { store } from "../storeSetup";
import { recordsPolicy } from "../records/policy";

function fetchPolicyIfIdle() {
  if (recordsPolicy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(recordsPolicy.fetch());
  }
}

export const routes = [
  {
    path: "/records/batch",
    fetch: async () => {
      await fetchPolicyIfIdle();
    },
  },
];
