import { createSelector } from "reselect";
import get from "lodash/fp/get";
import keys from "lodash/keys";

export const summaryByToken = get(["proposalVotes", "byToken"]);

export const bestBlock = get(["proposalVotes", "bestBlock"]);

export const makeGetProposalVoteSummary = (token) =>
  createSelector(summaryByToken, (summary) => {
    const tokenFromSummary = keys(summary).find(
      (s) => s.substring(0, 7) === token.substring(0, 7)
    );
    return summary[tokenFromSummary];
  });

export const makeGetProposalVoteResults = (token) =>
  createSelector(
    makeGetProposalVoteSummary(token),
    (summary) =>
      summary && {
        castvotes: summary.votes,
        startvotereply: summary.startvotereply
      }
  );
