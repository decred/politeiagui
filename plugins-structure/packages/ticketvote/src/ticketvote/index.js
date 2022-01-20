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
import { useTicketvotePolicy } from "./policy/usePolicy";

import {
  ticketvoteGetQuorumInVotes,
  ticketvoteGetVotesReceived,
  ticketvoteGetVoteStatusBarData,
} from "./helpers";

import { reducersArray } from "./constants";

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
  usePolicy: useTicketvotePolicy,
};

export const ticketvoteHelpers = {
  getQuorumInVotes: ticketvoteGetQuorumInVotes,
  getVotesReceived: ticketvoteGetVotesReceived,
  getStatusBarData: ticketvoteGetVoteStatusBarData,
};

export const ticketvoteConstants = {
  reducersArray,
};
