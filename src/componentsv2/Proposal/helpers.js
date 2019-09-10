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
 * @param {Object} voteStatus
 * @returns {Array} status bar data
 */
export const getStatusBarData = voteStatus => {
  return voteStatus.results
    .map(op => ({
      label: op.option.id,
      amount: op.votesreceived,
      color: op.option.id === "yes" ? "#41BE53" : "#ED6D47"
    }))
    .sort(a => (a.label === "yes" ? -1 : 1));
};

export const getProposalStatusTagProps = (proposal, voteStatus) => {
  if (isPublicProposal(proposal) && !!voteStatus) {
    switch (voteStatus.status) {
      case PROPOSAL_VOTING_NOT_AUTHORIZED:
        return { type: "blackTime", text: "Hasn't authorized yet" };
      case PROPOSAL_VOTING_AUTHORIZED:
        return { type: "yellowTime", text: "Waiting for approval" };
      case PROPOSAL_VOTING_ACTIVE:
        return { type: "bluePending", text: "Active" };
      case PROPOSAL_VOTING_FINISHED:
        if (isApprovedProposal(proposal, voteStatus)) {
          return { type: "greenCheck", text: "Finished" };
        } else {
          return { type: "grayNegative", text: "Finished" };
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
