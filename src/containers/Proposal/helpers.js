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
  PROPOSAL_STATUS_CENSORED,
  NOJS_ROUTE_PREFIX
} from "../../constants";
import { getTextFromIndexMd } from "src/helpers";

/**
 * Returns the total amount of votes received by a given proposal voteSummary
 * @param {Object} voteSummary
 */
export const getVotesReceived = (voteSummary) => {
  if (!voteSummary || !voteSummary.results) {
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
 * and it's deadline didn't expire yet
 * @param {Object} proposal
 * @param {Object} voteSummary
 * @returns {Boolean} isActiveApproved
 */
export const isActiveApprovedRfp = (proposal, voteSummary) =>
  isApprovedProposal(proposal, voteSummary) &&
  proposal.linkby &&
  isActiveRfp(proposal.linkby);

/**
 * Return true if RFP is still active and didn't expire
 * @param {number} linkby RFP deadline timestamp in seconds
 */
export const isActiveRfp = (linkby) =>
  Math.round(new Date().getTime() / 1000) < Number(linkby);

/**
 * Returns true if RFP's linkby meets the minimum period
 * @param {number} minlinkbyperiod min possible linkby period as seconds unix
 * @returns {Boolean} isRfpReadyToVote
 */
export const isRfpReadyToVote = (proposalLinkBy, minlinkbyperiod) => {
  const currentTimeSec = new Date().getTime() / 1000;
  return Math.round(currentTimeSec + minlinkbyperiod) < proposalLinkBy;
};

/**
 * Returns true if RFP was approved & deadline already expired
 * which means RFP ready to start runoff vote
 * @param {Object} proposal
 * @param {Object} voteSummary
 * @returns {Boolean} isActiveApproved
 */
export const isRfpReadyToRunoff = (proposal, voteSummary) =>
  isApprovedProposal(proposal, voteSummary) &&
  isVotingFinishedProposal(voteSummary) &&
  proposal.linkby &&
  new Date().getTime() / 1000 > Number(proposal.linkby);

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
  const { approved } = voteSummary;
  return approved;
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

/**
 * Retruns the propsoal url using a given token
 * if full token is passed (64 chars hex) then first 7 chars used
 * @param {String} token proposal token
 * @param {boolean} isJsEnabled true if Javascript is enabled
 */
export const getProposalUrl = (token, isJsEnabled) =>
  isJsEnabled
    ? `/proposals/${token.substring(0, 7)}`
    : `${NOJS_ROUTE_PREFIX}/proposals/${token}`;

/**
 * Retruns the url proposal's comments section using a given token
 * if full token is passed (64 chars hex) then first 7 chars used
 * @param {String} token proposal token
 * @param {boolean} isJsEnabled true if Javascript is enabled
 */
export const getCommentsUrl = (token, isJsEnabled) =>
  isJsEnabled
    ? `/proposals/${token.substring(0, 7)}?scrollToComments=true`
    : `${NOJS_ROUTE_PREFIX}/proposals/${token}?scrollToComments=true`;

/**
 * Returns author's account URL
 * @param {String} userid author user id
 * @param {boolean} isJsEnabled true if Javascript is enabled
 */
export const getAuthorUrl = (userid, isJsEnabled) =>
  isJsEnabled ? `/user/${userid}` : `${NOJS_ROUTE_PREFIX}/user/${userid}`;

export const goToFullProposal = (history, proposalURL) => () =>
  history.push(proposalURL);
