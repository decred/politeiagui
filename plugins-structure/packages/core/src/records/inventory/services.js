import { fetchPolicyIfIdle } from "../utils";
import { fetchRecordsInventoryEffect } from "./effects";

import { createSliceServices } from "../../toolkit";

export const services = [
  {
    id: "records/inventory",
    action: async () => {
      await fetchPolicyIfIdle();
    },
    effect: fetchRecordsInventoryEffect,
  },
];

export const sliceServices = createSliceServices({
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
