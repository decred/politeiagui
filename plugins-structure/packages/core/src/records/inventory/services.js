import { fetchPolicyIfIdle } from "../utils";
import { fetchRecordsInventoryEffect } from "./effects";
import { createSliceServices } from "../../toolkit";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "recordsInventory",
  services: {
    fetch: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
      },
      effect: fetchRecordsInventoryEffect,
    },
  },
});
