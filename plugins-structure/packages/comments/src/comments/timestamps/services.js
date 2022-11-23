import { fetchPolicyIfIdle } from "../utils";
import { validateCommentsTimestampsPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";
import { createSliceServices } from "@politeiagui/core/toolkit";

export const services = [
  {
    id: "comments/timestamps",
    action: async () => {
      await fetchPolicyIfIdle();
      validateCommentsTimestampsPageSize(store.getState());
    },
  },
];

export const sliceServices = createSliceServices({
  name: "commentsTimestamps",
  services: {
    fetch: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
        validateCommentsTimestampsPageSize(store.getState());
      },
    },
  },
});
