import { store } from "../storeSetup";
import { recordsPolicy } from "../records/policy";
import {
  validateInventoryPageSize,
  validateRecordsPageSize,
} from "../records/validation";

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
      validateRecordsPageSize(store.getState());
    },
  },
  {
    path: "/records/inventory",
    fetch: async () => {
      await fetchPolicyIfIdle();
      validateInventoryPageSize(store.getState());
    },
  },
];
