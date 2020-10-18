import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_FINISHED
} from "../../constants";
import {
  isApprovedProposal,
  isPublicProposal,
  isAbandonedProposal
} from "src/containers/Proposal/helpers";

/**
 * Converts the api data for vote status into an array of data
 * that can be used to render the StatusBar
 * @param {Object} voteSummary
 * @returns {Array} status bar data
 */
export const getStatusBarData = (voteSummary) =>
  voteSummary.results
    .map((op) => ({
      label: op.id,
      amount: op.votes,
      color: op.id === "yes" ? "#41BE53" : "#ED6D47"
    }))
    .sort((a) => (a.label === "yes" ? -1 : 1));

export const getProposalStatusTagProps = (
  proposal,
  voteSummary,
  isDarkTheme
) => {
  const isRfpSubmission = !!proposal.linkto;
  if (isPublicProposal(proposal) && !!voteSummary) {
    switch (voteSummary.status) {
      case PROPOSAL_VOTING_NOT_AUTHORIZED:
        return {
          type: isDarkTheme ? "blueTime" : "blackTime",
          text: isRfpSubmission
            ? "Waiting for runoff vote to start"
            : "Waiting for author to authorize voting"
        };
      case PROPOSAL_VOTING_AUTHORIZED:
        return {
          type: "yellowTime",
          text: "Waiting for admin to start voting"
        };
      case PROPOSAL_VOTING_ACTIVE:
        return { type: "bluePending", text: "Active" };
      case PROPOSAL_VOTING_FINISHED:
        if (isApprovedProposal(proposal, voteSummary)) {
          return { type: "greenCheck", text: "Finished" };
        } else {
          return {
            type: isDarkTheme ? "blueNegative" : "grayNegative",
            text: "Finished"
          };
        }
      default:
        break;
    }
  }

  if (isAbandonedProposal(proposal)) {
    return { type: "orangeNegativeCircled", text: "Abandoned" };
  }

  return { type: "grayNegative", text: "missing" };
};
