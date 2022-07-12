import { store } from "@politeiagui/core";
import { fetchPolicyIfIdle } from "../utils";
import { fetchRecordPiSummaries } from "./effects";
import { validatePiSummariesPageSize } from "../lib/validation";

export const services = [
  {
    id: "pi/summaries",
    action: async () => {
      await fetchPolicyIfIdle();
      validatePiSummariesPageSize(store.getState());
    },
    effect: fetchRecordPiSummaries,
  },
];
