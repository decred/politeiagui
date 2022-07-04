import { store } from "@politeiagui/core";
import { validatePiSummariesPageSize } from "./lib/validation";
import { piPolicy } from "./policy";
import { fetchRecordPiSummaries } from "./effects";

function fetchPolicyIfIdle() {
  if (piPolicy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(piPolicy.fetch());
  }
}

export const initializers = [
  {
    id: "pi/summaries",
    action: async () => {
      await fetchPolicyIfIdle();
      validatePiSummariesPageSize(store.getState());
    },
    effect: fetchRecordPiSummaries,
  },
  {
    id: "pi/new",
    action: async () => {
      await fetchPolicyIfIdle();
    },
  },
];
