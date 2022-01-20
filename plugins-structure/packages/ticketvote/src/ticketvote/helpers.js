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
