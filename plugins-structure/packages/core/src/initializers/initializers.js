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

export const initializers = [
  {
    id: "records/batch",
    action: async () => {
      await fetchPolicyIfIdle();
      validateRecordsPageSize(store.getState());
    },
  },
  {
    id: "records/inventory",
    action: async () => {
      await fetchPolicyIfIdle();
      validateInventoryPageSize(store.getState());
    },
  },
];
