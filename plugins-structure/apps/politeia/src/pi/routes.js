import { store } from "@politeiagui/core";
import { validatePiSummariesPageSize } from "./lib/validation";
import { piPolicy } from "./policy";

function fetchPolicyIfIdle() {
  if (piPolicy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(piPolicy.fetch());
  }
}

export const routes = [
  {
    path: "/pi/summaries",
    fetch: async () => {
      await fetchPolicyIfIdle();
      validatePiSummariesPageSize(store.getState());
    },
  },
  {
    path: "/pi/new",
    fetch: async () => {
      await fetchPolicyIfIdle();
    },
  },
];
