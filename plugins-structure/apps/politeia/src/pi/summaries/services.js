import { store } from "@politeiagui/core";
import { fetchPolicyIfIdle } from "../utils";
import {
  fetchAllRecordsPiSummaries,
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
    id: "pi/summaries/batch",
    action: async () => {
      await fetchPolicyIfIdle();
      validatePiSummariesPageSize(store.getState());
    },
    effect: fetchRecordsPiSummaries,
  },
  {
    id: "pi/summaries/all",
    action: async () => {
      await fetchPolicyIfIdle();
      validatePiSummariesPageSize(store.getState());
    },
    effect: fetchAllRecordsPiSummaries,
  },
];
