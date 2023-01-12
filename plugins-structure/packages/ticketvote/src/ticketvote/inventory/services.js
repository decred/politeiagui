import { fetchPolicyIfIdle } from "../utils";
import { fetchTicketvoteRecordsInventory } from "./effects";
import { createSliceServices } from "@politeiagui/core/toolkit";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "ticketvoteInventory",
  services: {
    fetch: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
      },
      effect: fetchTicketvoteRecordsInventory,
    },
  },
});
