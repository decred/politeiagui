import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_FINISHED,
  NOJS_ROUTE_PREFIX
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
export const getStatusBarData = (voteSummary) => {
  return voteSummary.results
    .map((op) => ({
      label: op.option.id,
      amount: op.votesreceived,
      color: op.option.id === "yes" ? "#41BE53" : "#ED6D47"
    }))
    .sort((a) => (a.label === "yes" ? -1 : 1));
};

export const getProposalUrl = (token, javascriptEnabled) =>
  javascriptEnabled
    ? `/proposals/${token}`
    : `${NOJS_ROUTE_PREFIX}/proposals/${token}`;

export const getCommentsUrl = (proposalToken, javascriptEnabled) =>
  javascriptEnabled
    ? `/proposals/${proposalToken}?scrollToComments=true`
    : `${NOJS_ROUTE_PREFIX}/proposals/${proposalToken}?scrollToComments=true`;

export const getAuthorUrl = (userid, javascriptEnabled) =>
  javascriptEnabled ? `/user/${userid}` : `${NOJS_ROUTE_PREFIX}/user/${userid}`;

export const getProposalStatusTagProps = (proposal, voteSummary) => {
  if (isPublicProposal(proposal) && !!voteSummary) {
    switch (voteSummary.status) {
      case PROPOSAL_VOTING_NOT_AUTHORIZED:
        return {
          type: "blackTime",
          text: proposal.linkto
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
