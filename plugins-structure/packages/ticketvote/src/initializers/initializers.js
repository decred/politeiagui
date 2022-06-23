import { store } from "@politeiagui/core";
import { ticketvote } from "../ticketvote";
import {
  validateTicketvoteInventoryPageSize,
  validateTicketvoteSummariesPageSize,
  validateTicketvoteTimestampsPageSize,
} from "../lib/validation";

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
      validateTicketvoteInventoryPageSize(store.getState());
    },
  },
  {
    id: "ticketvote/summaries",
    action: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteSummariesPageSize(store.getState());
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
