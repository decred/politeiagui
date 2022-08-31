import { fetchPolicyIfIdle } from "../utils";
import { fetchTicketvoteRecordsInventory } from "./effects";

export const services = [
  {
    id: "ticketvote/inventory",
    action: async () => {
      await fetchPolicyIfIdle();
    },
    effect: fetchTicketvoteRecordsInventory,
  },
];
