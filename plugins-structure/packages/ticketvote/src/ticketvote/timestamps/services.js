import { fetchPolicyIfIdle } from "../utils";
import { validateTicketvoteTimestampsPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";
import { createSliceServices } from "@politeiagui/core/toolkit";

export const services = [
  {
    id: "ticketvote/timestamps",
    action: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteTimestampsPageSize(store.getState());
    },
  },
];

export const { pluginServices, serviceSetups } = createSliceServices({
  name: "ticketvoteTimestamps",
  services: {
    fetch: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
        validateTicketvoteTimestampsPageSize(store.getState());
      },
    },
  },
});
