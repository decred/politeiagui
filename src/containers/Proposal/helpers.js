import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import {
  BLOCK_DURATION_MAINNET,
  BLOCK_DURATION_TESTNET,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES
} from "../../constants";
import { getTextFromIndexMd } from "src/helpers";

/**
 * Returns the total amount of votes received by a given proposal voteStatus
 * @param {Object} voteStatus
 */
export const getVotesReceived = voteStatus => {
  if (!voteStatus) {
    return 0;
  }
  return voteStatus.totalvotes;
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
  return !!proposal && proposal.status === PROPOSAL_STATUS_PUBLIC;
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
 * @param {Object} voteStatus
 * @returns {Boolean} isVotingNotAuthorized
 */
export const isVotingNotAuthorizedProposal = voteStatus => {
  return !!voteStatus && voteStatus.status === PROPOSAL_VOTING_NOT_AUTHORIZED;
};

/**
 * Returns true if the given proposal is public, but voting
 * has finished already
 * @param {Object} voteStatus
 * @returns {Boolean} isVotingFinished
 */
export const isVotingFinishedProposal = voteStatus => {
  return !!voteStatus && voteStatus.status === PROPOSAL_VOTING_FINISHED;
};

/**
 * Returns true if the given proposal is editable
 * @param {Object} proposal
 * @param {Object} voteStatus
 * @returns {Boolean} isEditable
 */
export const isEditableProposal = (proposal, voteStatus) => {
  return (
    isUnreviewedProposal(proposal) ||
    (isPublicProposal(proposal) && isVotingNotAuthorizedProposal(voteStatus))
  );
};

/**
 * Returns true if the given proposal is under discussion
 * @param {Object} proposal
 * @param {Object} voteStatus
 * @returns {Boolean} isUnderDiscussion
 */
export const isUnderDiscussionProposal = (proposal, voteStatus) => {
  return (
    isPublicProposal(proposal) &&
    !isVoteActiveProposal(voteStatus) &&
    !isVotingFinishedProposal(voteStatus)
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
 * @param {Object} proposal
 * @param {Object} voteStatus
 * @returns {Boolean} isApproved
 */
export const isApprovedProposal = (proposal, voteStatus) => {
  if (!proposal || !voteStatus || !isPublicProposal(proposal)) {
    return false;
  }
  const {
    quorumpercentage,
    passpercentage,
    numofeligiblevotes,
    optionsresult,
    totalvotes
  } = voteStatus;
  const quorumInVotes = (quorumpercentage * numofeligiblevotes) / 100;
  const quorumPasses = totalvotes >= quorumInVotes;
  if (!quorumPasses) {
    return false;
  }

  const yesVotes = optionsresult.find(op => op.option.id === "yes")
    .votesreceived;

  return yesVotes > (passpercentage * totalvotes) / 100;
};

/**
 * Returns true if the proposal vote is active
 * @param {Object} voteStatus
 * @returns {Boolean} isVoteActiceProposal
 */
export const isVoteActiveProposal = voteStatus =>
  !!voteStatus && voteStatus.status === PROPOSAL_VOTING_ACTIVE;

/**
 * Return the amount of blocks left to the end of the voting period
 * @param {Object} voteStatus
 * @param {Number} chainHeight
 * @returns {Number} number of blocks left
 */
export const getVoteBlocksLeft = (voteStatus, chainHeight) => {
  if (!voteStatus) return null;
  const { endheight } = voteStatus;
  return +endheight - chainHeight;
};

/**
 * Return a "human readable" message of how long will take until the voting ends
 * @param {Object} voteStatus
 * @param {Number} chainHeight
 * @param {Boolean} isTestnet
 * @returns {String} message
 */
export const getVoteTimeLeftInWords = (voteStatus, chainHeight, isTestnet) => {
  if (!voteStatus || voteStatus.status !== PROPOSAL_VOTING_ACTIVE) {
    return "";
  }

  const blocks = getVoteBlocksLeft(voteStatus, chainHeight);
  const blockTimeMinutes = isTestnet
    ? blocks * BLOCK_DURATION_TESTNET
    : blocks * BLOCK_DURATION_MAINNET;
  const mili = blockTimeMinutes * 60000;
  const dateMs = new Date(mili + Date.now()); // gets time in ms

  return distanceInWordsToNow(dateMs, { addSuffix: true });
};

/**
 * Returns the markdown content from an array of proposal files
 * @param {Array} files
 * @returns {String} markdownContent
 */
export const getMarkdownContent = files => {
  const markdownFile = files.find(f => f.name === "index.md");
  return getTextFromIndexMd(markdownFile);
};
