import { fetchPolicyIfIdle } from "../utils";
import {
  fetchRecordsInventoryEffect,
  fetchRecordsUserInventoryEffect,
} from "./effects";
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
    userInventory: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
      },
      effect: fetchRecordsUserInventoryEffect,
    },
  },
});
