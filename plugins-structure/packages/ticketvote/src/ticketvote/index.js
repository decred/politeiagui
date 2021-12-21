import { ticketvoteDetails } from "./details";
import { ticketvoteInventory } from "./inventory";
import { ticketvotePolicy } from "./policy";
import { ticketvoteResults } from "./results";
import { ticketvoteSummaries } from "./summaries";
import { ticketvoteTimestamps } from "./timestamps";

import { useTicketvoteInventory } from "./inventory/useInventory";
import { useTicketvoteResults } from "./results/useResults";
import { useTicketvoteDetails } from "./details/useDetails";
import { useTicketvoteTimestamps } from "./timestamps/useTimestamps";
import { useTicketvoteSummaries } from "./summaries/useSummaries";

import {
  ticketvoteConnectReducers,
  ticketvoteGetQuorumInVotes,
  ticketvoteGetVotesReceived,
  ticketvoteGetVoteStatusBarData,
} from "./helpers";

export const ticketvote = {
  inventory: ticketvoteInventory,
  details: ticketvoteDetails,
  timestamps: ticketvoteTimestamps,
  results: ticketvoteResults,
  policy: ticketvotePolicy,
  summaries: ticketvoteSummaries,
};

export const ticketvoteHooks = {
  useInventory: useTicketvoteInventory,
  useDetails: useTicketvoteDetails,
  useResults: useTicketvoteResults,
  useTimestamps: useTicketvoteTimestamps,
  useSummaries: useTicketvoteSummaries,
};

export const ticketvoteHelpers = {
  connectReducers: ticketvoteConnectReducers,
  getQuorumInVotes: ticketvoteGetQuorumInVotes,
  getVotesReceived: ticketvoteGetVotesReceived,
  getStatusBarData: ticketvoteGetVoteStatusBarData,
};
