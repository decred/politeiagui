import { store } from "@politeiagui/core";
import { piPolicy } from "./policy";
import {
  PROPOSAL_STATUS_CLOSED,
  PROPOSAL_STATUS_COMPLETED,
} from "./lib/constants";

export function fetchPolicyIfIdle() {
  if (piPolicy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(piPolicy.fetch());
  }
}

export function isProposalCompleteOrClosed(status) {
  return [PROPOSAL_STATUS_COMPLETED, PROPOSAL_STATUS_CLOSED].includes(status);
}
