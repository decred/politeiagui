import { createSelector } from "reselect";
import get from "lodash/fp/get";
import keys from "lodash/keys";
import { shortRecordToken } from "src/helpers";

export const voteSummariesByToken = get(["proposalVotes", "byToken"]);

export const bestBlock = get(["proposalVotes", "bestBlock"]);

export const makeGetProposalVoteSummary = (token) =>
  createSelector(voteSummariesByToken, (voteSummaries) => {
    const tokenFromSummary = keys(voteSummaries).find(
      (s) => shortRecordToken(s) === shortRecordToken(token)
    );
    return voteSummaries[tokenFromSummary];
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
