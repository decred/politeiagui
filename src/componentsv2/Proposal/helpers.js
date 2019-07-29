import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import {
  BLOCK_DURATION_MAINNET,
  BLOCK_DURATION_TESTNET,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_NOT_AUTHORIZED
} from "src/constants";
import { getTextFromIndexMd } from "src/helpers";
import {
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES
} from "../../constants";

export const getMarkdownContent = files => {
  const markdownFile = files.find(f => f.name === "index.md");
  return getTextFromIndexMd(markdownFile);
};

/**
 * Returns the total amount of votes received by a given proposal
 * @param {Object} proposal
 */
export const getVotesReceived = proposal => {
  if (!proposal || !proposal.voteStatus) {
    return 0;
  }
  return proposal.voteStatus.totalvotes;
};

/**
 * Converts the api data for vote status into an array of data
 * that can be used to render the StatusBar
 * @param {Object} voteStatus
 * @returns {Array} status bar data
 */
export const getStatusBarData = voteStatus => {
  return voteStatus.optionsresult
    .map(op => ({
      label: op.option.id,
      amount: op.votesreceived,
      color: op.option.id === "yes" ? "#41BE53" : "#ED6D47"
    }))
    .sort(a => (a.label === "yes" ? -1 : 1));
};

/**
 * Return the votes quorum of a given proposal vote status
 * @param {Object} voteStatus
 */
export const getQuorumInVotes = voteStatus =>
  Math.trunc(
    (voteStatus.numofeligiblevotes * voteStatus.quorumpercentage) / 100
  );

/**
 * Returns true if the given proposal is public
 * @param {Object} proposal
 * @returns {Boolean} isPublic
 */
export const isPublicProposal = proposal => {
  return proposal.status === PROPOSAL_STATUS_PUBLIC;
};

/**
 * Returns true if the given proposal is unreviewed
 * @param {Object} proposal
 * @returns {Boolean} isUnreviewed
 */
export const isUnreviewedProposal = proposal => {
  return (
    proposal.status === PROPOSAL_STATUS_UNREVIEWED ||
    proposal.status === PROPOSAL_STATUS_UNREVIEWED_CHANGES
  );
};

/**
 * Returns true if the given proposal is public, but voting
 * is not authorized yet.
 * @param {Object} proposal
 * @returns {Boolean} isUnreviewed
 */
export const isVotingNotAuthorizedProposal = proposal => {
  return (
    !!proposal &&
    !!proposal.voteStatus &&
    proposal.voteStatus.status === PROPOSAL_VOTING_NOT_AUTHORIZED
  );
};

/**
 * Returns true if the given proposal is editable
 * @param {Object} proposal
 * @returns {Boolean} isUnreviewed
 */
export const isEditableProposal = proposal => {
  return (
    isUnreviewedProposal(proposal) ||
    (isPublicProposal(proposal) && isVotingNotAuthorizedProposal(proposal))
  );
};

/**
 * Returns true if the given proposal is abandoned
 * @param {Object} proposal
 * @returns {Boolean} isAbandoned
 */
export const isAbandonedProposal = proposal => {
  return proposal.status === PROPOSAL_STATUS_ABANDONED;
};

/**
 * Returns true if the given proposal is approved
 * @param {Object} voteStatus
 * @returns {Boolean} isApproved
 */
export const isApprovedProposal = proposal => {
  if (!proposal || !proposal.voteStatus || !isPublicProposal(proposal)) {
    return false;
  }
  const {
    quorumpercentage,
    passpercentage,
    numofeligiblevotes,
    optionsresult,
    totalvotes
  } = proposal.voteStatus;
  const quorumInVotes = (quorumpercentage * numofeligiblevotes) / 100;
  const quorumPasses = totalvotes >= quorumInVotes;
  if (!quorumPasses) {
    return false;
  }

  const yesVotes = optionsresult.find(op => op.option.id === "yes")
    .votesreceived;

  return yesVotes > (passpercentage * totalvotes) / 100;
};

export const isVoteActiveProposal = proposal =>
  !!proposal &&
  !!proposal.voteStatus &&
  proposal.voteStatus.status === PROPOSAL_VOTING_ACTIVE;

/**
 * Return the properties to be passed to the StatusTag UI component
 * @param {Object} proposal
 */
export const getProposalStatusTagProps = proposal => {
  if (isPublicProposal(proposal)) {
    switch (proposal.voteStatus.status) {
      case PROPOSAL_VOTING_NOT_AUTHORIZED:
        return { type: "blackTime", text: "Hasn't authorized yet" };
      case PROPOSAL_VOTING_AUTHORIZED:
        return { type: "yellowTime", text: "Waiting for approval" };
      case PROPOSAL_VOTING_ACTIVE:
        return { type: "bluePending", text: "Active" };
      case PROPOSAL_VOTING_FINISHED:
        if (isApprovedProposal(proposal)) {
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

/**
 * Return the amount of blocks left to the end of the voting period
 * @param {Object} proposal
 * @param {Number} chainHeight
 * @returns {Number} number of blocks left
 */
export const getVoteBlocksLeft = (proposal, chainHeight) => {
  if (!isPublicProposal(proposal)) return null;
  const {
    voteStatus: { endheight }
  } = proposal;
  return +endheight - chainHeight;
};

/**
 * Return a "human readable" message of how long will take until the voting ends
 * @param {Object} proposal
 * @param {Number} chainHeight
 * @param {Boolean} isTestnet
 * @returns {String} message
 */
export const getVoteTimeLeftInWords = (proposal, chainHeight, isTestnet) => {
  if (
    !proposal ||
    !isPublicProposal(proposal) ||
    proposal.voteStatus.status !== PROPOSAL_VOTING_ACTIVE
  ) {
    return "";
  }

  const blocks = getVoteBlocksLeft(proposal, chainHeight);
  const blockTimeMinutes = isTestnet
    ? blocks * BLOCK_DURATION_TESTNET
    : blocks * BLOCK_DURATION_MAINNET;
  const mili = blockTimeMinutes * 60000;
  const dateMs = new Date(mili + Date.now()); // gets time in ms

  // console.log(+endheight, chainHeight);
  return distanceInWordsToNow(dateMs, { addSuffix: true });
};
