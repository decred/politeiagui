import { fetchPolicyIfIdle } from "../utils";
import { fetchRecordsInventoryEffect } from "./effects";

export const services = [
  {
    id: "records/inventory",
    action: async () => {
      await fetchPolicyIfIdle();
    },
    effect: fetchRecordsInventoryEffect,
  },
];
