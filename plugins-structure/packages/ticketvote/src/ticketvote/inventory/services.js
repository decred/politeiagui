import { fetchPolicyIfIdle } from "../utils";
import { fetchTicketvoteRecordsInventory } from "./effects";
import { createSliceServices } from "@politeiagui/core/toolkit";

export const services = [
  {
    id: "ticketvote/inventory",
    action: async () => {
      await fetchPolicyIfIdle();
    },
    effect: fetchTicketvoteRecordsInventory,
  },
];

export const { pluginServices, serviceSetups } = createSliceServices({
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
