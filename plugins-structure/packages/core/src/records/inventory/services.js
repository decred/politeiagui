import { validateInventoryPageSize } from "../validation";
import { store } from "../../storeSetup";
import { fetchPolicyIfIdle } from "../utils";

export const services = [
  {
    id: "records/inventory",
    action: async () => {
      await fetchPolicyIfIdle();
      validateInventoryPageSize(store.getState());
    },
  },
];
