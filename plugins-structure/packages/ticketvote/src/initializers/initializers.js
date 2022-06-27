import { store } from "@politeiagui/core";
import { ticketvote } from "../ticketvote";
import { validateTicketvoteTimestampsPageSize } from "../lib/validation";

function fetchPolicyIfIdle() {
  if (ticketvote.policy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(ticketvote.policy.fetch());
  }
}

/**
 * Routes for ticketvote plugin router.
 */
export const initializers = [
  {
    id: "ticketvote/inventory",
    action: async () => {
      await fetchPolicyIfIdle();
    },
  },
  {
    id: "ticketvote/summaries",
    action: async () => {
      await fetchPolicyIfIdle();
    },
  },
  {
    id: "ticketvote/timestamps",
    action: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteTimestampsPageSize(store.getState());
    },
  },
];
