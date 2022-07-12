import { fetchPolicyIfIdle } from "../utils";
import { validateTicketvoteInventoryPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";

export const services = [
  {
    id: "ticketvote/inventory",
    action: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteInventoryPageSize(store.getState());
    },
  },
];
