import { store } from "../storeSetup";
import { recordsPolicy } from "./policy";

function fetchPolicyIfIdle() {
  if (recordsPolicy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(recordsPolicy.fetch());
  }
}

export const initializers = [
  {
    id: "records/batch",
    action: async () => {
      await fetchPolicyIfIdle();
    },
  },
  {
    id: "records/inventory",
    action: async () => {
      await fetchPolicyIfIdle();
    },
  },
];
