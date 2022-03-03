import { ticketvoteDetails } from "./details";
import { ticketvoteInventory } from "./inventory";
import { ticketvotePolicy } from "./policy";
import { ticketvoteResults } from "./results";
import { ticketvoteSummaries } from "./summaries";
import { ticketvoteTimestamps } from "./timestamps";

import {
  ticketvoteGetQuorumInVotes,
  ticketvoteGetVoteStatusBarData,
  ticketvoteGetVotesReceived,
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

export const ticketvoteHelpers = {
  getQuorumInVotes: ticketvoteGetQuorumInVotes,
  getVotesReceived: ticketvoteGetVotesReceived,
  getStatusBarData: ticketvoteGetVoteStatusBarData,
};

export const ticketvoteConstants = {
  reducersArray,
};
