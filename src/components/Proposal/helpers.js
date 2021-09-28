import {
  PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED,
  PROPOSAL_SUMMARY_STATUS_ABANDONED,
  PROPOSAL_SUMMARY_STATUS_UNVETTED_CENSORED,
  PROPOSAL_SUMMARY_STATUS_CENSORED,
  PROPOSAL_SUMMARY_STATUS_VOTE_STARTED,
  PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW,
  PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED,
  PROPOSAL_SUMMARY_STATUS_REJECTED,
  PROPOSAL_SUMMARY_STATUS_ACTIVE,
  PROPOSAL_SUMMARY_STATUS_CLOSED,
  PROPOSAL_SUMMARY_STATUS_COMPLETED
} from "src/constants";
import { isPublicProposal } from "src/containers/Proposal/helpers";

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
  proposalSummary,
  isDarkTheme
) => {
  const isRfpSubmission = !!proposal.linkto;
  if (isPublicProposal(proposal) && !!proposalSummary) {
    switch (proposalSummary.status) {
      case PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED:
      case PROPOSAL_SUMMARY_STATUS_ABANDONED:
        return {
          type: isDarkTheme ? "blueNegative" : "grayNegative",
          text: "Abandoned"
        };

      case PROPOSAL_SUMMARY_STATUS_UNVETTED_CENSORED:
      case PROPOSAL_SUMMARY_STATUS_CENSORED:
        return {
          type: "orangeNegativeCircled",
          text: "Censored"
        };

      case PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW:
        return {
          type: isDarkTheme ? "blueTime" : "blackTime",
          text: isRfpSubmission
            ? "Waiting for runoff vote to start"
            : "Waiting for author to authorize voting"
        };

      case PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED:
        return {
          type: "yellowTime",
          text: "Waiting for admin to start voting"
        };

      case PROPOSAL_SUMMARY_STATUS_VOTE_STARTED:
        return { type: "bluePending", text: "Active" };

      case PROPOSAL_SUMMARY_STATUS_REJECTED:
        return {
          type: "orangeNegativeCircled",
          text: "Rejected"
        };

      case PROPOSAL_SUMMARY_STATUS_ACTIVE:
        return { type: "greenCheck", text: "Approved" };

      case PROPOSAL_SUMMARY_STATUS_CLOSED:
        return { type: "greenCheck", text: "Closed" };

      case PROPOSAL_SUMMARY_STATUS_COMPLETED:
        return { type: "greenCheck", text: "Completed" };

      default:
        break;
    }
  }

  return { type: "grayNegative", text: "missing" };
};
