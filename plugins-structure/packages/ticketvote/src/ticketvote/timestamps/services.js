import { fetchPolicyIfIdle } from "../utils";
import { validateTicketvoteTimestampsPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";

export const services = [
  {
    id: "ticketvote/timestamps",
    action: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteTimestampsPageSize(store.getState());
    },
  },
];
