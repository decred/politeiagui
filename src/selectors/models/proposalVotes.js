import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const summaryByToken = get(["proposalVotes", "byToken"]);

export const bestBlock = get(["proposalVotes", "bestBlock"]);

export const makeGetProposalVoteSummary = (token) =>
  createSelector(summaryByToken, get(token));

export const makeGetProposalVoteResults = (token) =>
  createSelector(
    makeGetProposalVoteSummary(token),
    (summary) =>
      summary && {
        castvotes: summary.votes,
        startvotereply: summary.startvotereply
      }
  );
