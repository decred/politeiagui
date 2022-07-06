import { fetchPolicyIfIdle } from "../utils";
import { validateCommentsTimestampsPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";

export const services = [
  {
    id: "comments/timestamps",
    action: async () => {
      await fetchPolicyIfIdle();
      validateCommentsTimestampsPageSize(store.getState());
    },
  },
];
