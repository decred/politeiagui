import { store } from "@politeiagui/core";
import { fetchPolicyIfIdle } from "../utils";
import {
  fetchRecordsPiSummaries,
  fetchSingleRecordPiSummaries,
} from "./effects";
import { validatePiSummariesPageSize } from "../lib/validation";

export const services = [
  {
    id: "pi/summaries/single",
    action: async () => {
      await fetchPolicyIfIdle();
      validatePiSummariesPageSize(store.getState());
    },
    effect: fetchSingleRecordPiSummaries,
  },
  {
    id: "pi/summaries",
    action: async () => {
      await fetchPolicyIfIdle();
      validatePiSummariesPageSize(store.getState());
    },
    effect: fetchRecordsPiSummaries,
  },
];
