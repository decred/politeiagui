import { store } from "@politeiagui/core";

import details from "./details/detailsSlice";
import inventory from "./inventory/inventorySlice";
import policy from "./policy/policySlice";
import results from "./results/resultsSlice";
import summaries from "./summaries/summariesSlice";
import timestamps from "./timestamps/timestampsSlice";

import pick from "lodash/fp/pick";

const reducersMap = {
  details: {
    key: "ticketvoteDetails",
    reducer: details,
  },
  inventory: {
    key: "ticketvoteInventory",
    reducer: inventory,
  },
  policy: {
    key: "ticketvotePolicy",
    reducer: policy,
  },
  results: {
    key: "ticketvoteResults",
    reducer: results,
  },
  summaries: {
    key: "ticketvoteSummaries",
    reducer: summaries,
  },
  timestamps: {
    key: "ticketvoteTimestamps",
    reducer: timestamps,
  },
};

export async function ticketvoteConnectReducers(reducersNames) {
  const reducers = reducersNames
    ? pick(reducersNames)(reducersMap)
    : reducersMap;
  await Object.values(reducers).forEach(async ({ key, reducer }) => {
    await store.injectReducer(key, reducer);
  });
}

/**
 * Return the votes quorum of a given record vote summary
 * @param {Object} voteSummary
 */
export const ticketvoteGetQuorumInVotes = (voteSummary) =>
  Math.trunc(
    (voteSummary.eligibletickets * voteSummary.quorumpercentage) / 100
  );

/**
 * Returns the total amount of votes received by given voteSummary
 * @param {Object} voteSummary
 */
export const ticketvoteGetVotesReceived = (voteSummary) => {
  if (!voteSummary || !voteSummary.results) {
    return 0;
  }
  return voteSummary.results.reduce(
    (totalVotes, option) => (totalVotes += option.votes),
    0
  );
};

/**
 * Converts the api data for vote status into an array of data
 * that can be used to render the StatusBar
 * @param {Object} voteSummary
 * @returns {Array} status bar data
 */
export const ticketvoteGetVoteStatusBarData = (voteSummary) =>
  voteSummary.results
    .map((op) => ({
      label: op.id,
      amount: op.votes,
      color: op.id === "yes" ? "#41BE53" : "#ED6D47",
    }))
    .sort((a) => (a.label === "yes" ? -1 : 1));
