import { store } from "@politeiagui/core";
import { ticketvote } from "../ticketvote";
import {
  validateTicketvoteInventoryPageSize,
  validateTicketvoteSummariesPageSize,
  validateTicketvoteTimestampsPageSize,
} from "../lib/validation";

export const ROUTE_TICKETVOTE_INVENTORY = "/ticketvote/inventory";
export const ROUTE_TICKETVOTE_SUMMARIES = "/ticketvote/summaries";
export const ROUTE_TICKETVOTE_TIMESTAMPS = "/ticketvote/timestamps";

function fetchPolicyIfIdle() {
  if (ticketvote.policy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(ticketvote.policy.fetch());
  }
}

// Routes for ticketvote plugin
export const routes = [
  {
    path: ROUTE_TICKETVOTE_INVENTORY,
    fetch: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteInventoryPageSize(store.getState());
    },
  },
  {
    path: ROUTE_TICKETVOTE_SUMMARIES,
    fetch: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteSummariesPageSize(store.getState());
    },
  },
  {
    path: ROUTE_TICKETVOTE_TIMESTAMPS,
    fetch: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteTimestampsPageSize(store.getState());
    },
  },
];
