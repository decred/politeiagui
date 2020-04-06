import {
  BLOCK_DURATION_MAINNET,
  BLOCK_DURATION_TESTNET,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  PROPOSAL_STATUS_CENSORED
} from "../../constants";
import { getTextFromIndexMd } from "src/helpers";

/**
 * Returns the total amount of votes received by a given proposal voteSummary
 * @param {Object} voteSummary
 */
export const getVotesReceived = (voteSummary) => {
  if (!voteSummary) {
    return 0;
  }
  return voteSummary.results.reduce(
    (totalVotes, option) => (totalVotes += option.votesreceived),
    0
  );
};

/**
 * Return the votes quorum of a given proposal vote status
 * @param {Object} voteSummary
 */
export const getQuorumInVotes = (voteSummary) =>
  Math.trunc(
    (voteSummary.eligibletickets * voteSummary.quorumpercentage) / 100
  );

/**
 * Returns true if the given proposal is public
 * @param {Object} proposal
 * @returns {Boolean} isPublic
 */
export const isPublicProposal = (proposal) =>
  !!proposal && proposal.status === PROPOSAL_STATUS_PUBLIC;

/**
 * Returns true if the given proposal is an approved RFP
 * and it's deadline didn;t expire yet
 * @param {Object} proposal
 * @param {Object} voteSummary
 * @returns {Boolean} isActiveApproved
 */
export const isActiveApprovedRFP = (proposal, voteSummary) => {
  return (
    isApprovedProposal(proposal, voteSummary) &&
    proposal.linkby &&
    new Date().getTime() < +proposal.linkby
  );
};

/**
 * Returns true if the given proposal is unreviewed
 * @param {Object} proposal
 * @returns {Boolean} isUnreviewed
 */
export const isUnreviewedProposal = (proposal) =>
  proposal.status === PROPOSAL_STATUS_UNREVIEWED ||
  proposal.status === PROPOSAL_STATUS_UNREVIEWED_CHANGES;

/**
 * Returns true if the given proposal is censored
 * @param {Object} proposal
 * @returns {Boolean} isCensored
 */
export const isCensoredProposal = (proposal) =>
  proposal.status === PROPOSAL_STATUS_CENSORED;

/**
 * Returns true if the given proposal is public, but voting
 * is not authorized yet.
 * @param {Object} voteSummary
 * @returns {Boolean} isVotingNotAuthorized
 */
export const isVotingNotAuthorizedProposal = (voteSummary) =>
  !!voteSummary && voteSummary.status === PROPOSAL_VOTING_NOT_AUTHORIZED;

/**
 * Returns true if the given proposal is public, but voting
 * has finished already
 * @param {Object} voteSummary
 * @returns {Boolean} isVotingFinished
 */
export const isVotingFinishedProposal = (voteSummary) =>
  !!voteSummary && voteSummary.status === PROPOSAL_VOTING_FINISHED;

/**
 * Returns true if the given proposal is editable
 * @param {Object} proposal
 * @param {Object} voteSummary
 * @returns {Boolean} isEditable
 */
export const isEditableProposal = (proposal, voteSummary) =>
  isUnreviewedProposal(proposal) ||
  (isPublicProposal(proposal) && isVotingNotAuthorizedProposal(voteSummary));

/**
 * Returns true if the given proposal is under discussion
 * @param {Object} proposal
 * @param {Object} voteSummary
 * @returns {Boolean} isUnderDiscussion
 */
export const isUnderDiscussionProposal = (proposal, voteSummary) =>
  isPublicProposal(proposal) &&
  !isVoteActiveProposal(voteSummary) &&
  !isVotingFinishedProposal(voteSummary);

/**
 * Returns true if the given proposal is abandoned
 * @param {Object} proposal
 * @returns {Boolean} isAbandoned
 */
export const isAbandonedProposal = (proposal) =>
  proposal.status === PROPOSAL_STATUS_ABANDONED;

/**
 * Returns true if the given proposal is approved
 * @param {Object} proposal
 * @param {Object} voteSummary
 * @returns {Boolean} isApproved
 */
export const isApprovedProposal = (proposal, voteSummary) => {
  if (!proposal || !voteSummary || !isPublicProposal(proposal)) {
    return false;
  }
  const {
    quorumpercentage = 0,
    passpercentage = 0,
    eligibletickets: numofeligiblevotes,
    results
  } = voteSummary;
  const totalVotes = getVotesReceived(voteSummary);
  const quorumInVotes = (quorumpercentage * numofeligiblevotes) / 100;
  const quorumPasses = totalVotes >= quorumInVotes;
  if (!quorumPasses) {
    return false;
  }

  const yesVotes = results.find((op) => op.option.id === "yes").votesreceived;

  return yesVotes > (passpercentage * totalVotes) / 100;
};

/**
 * Returns true if the proposal vote is active
 * @param {Object} voteSummary
 * @returns {Boolean} isVoteActiceProposal
 */
export const isVoteActiveProposal = (voteSummary) =>
  !!voteSummary && voteSummary.status === PROPOSAL_VOTING_ACTIVE;

/**
 * Return the amount of blocks left to the end of the voting period
 * @param {Object} voteSummary
 * @param {Number} chainHeight
 * @returns {Number} number of blocks left
 */
export const getVoteBlocksLeft = (voteSummary, chainHeight) => {
  if (!voteSummary) return null;
  const { endheight } = voteSummary;
  return +endheight - chainHeight;
};

/**
 * Returns a timestamp of vote end date
 * @param {Object} voteSummary
 * @param {Number} chainHeight
 * @param {Boolean} isTestnet
 * @returns {Number}
 */
export const getVoteEndTimestamp = (voteSummary, chainHeight, isTestnet) => {
  if (!voteSummary) {
    return "";
  }
  const blocks = getVoteBlocksLeft(voteSummary, chainHeight);
  const blockTimeMinutes = isTestnet
    ? blocks * BLOCK_DURATION_TESTNET
    : blocks * BLOCK_DURATION_MAINNET;
  const mili = blockTimeMinutes * 60000;
  const dateMs = new Date(mili + Date.now());
  return Math.round(dateMs / 1000); // returns unix timestamp
};

/**
 * Returns the markdown content from an array of proposal files
 * @param {Array} files
 * @returns {String} markdownContent
 */
export const getMarkdownContent = (files) => {
  const markdownFile = files.find((f) => f.name === "index.md");
  return getTextFromIndexMd(markdownFile);
};

/**
 * Returns the proposal censorship token
 * @param {Object} proposal
 * @returns {String} censorhipToken
 */
export const getProposalToken = (proposal) =>
  proposal && proposal.censorshiprecord && proposal.censorshiprecord.token;
