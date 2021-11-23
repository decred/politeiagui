import {
  BLOCK_DURATION_MAINNET,
  BLOCK_DURATION_TESTNET,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_VOTING_APPROVED,
  PROPOSAL_STATUS_ARCHIVED,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATE_VETTED,
  PROPOSAL_STATE_UNVETTED,
  PROPOSAL_SUMMARY_STATUS_CLOSED,
  PROPOSAL_SUMMARY_STATUS_COMPLETED,
  PROPOSAL_SUMMARY_STATUS_ACTIVE,
  PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED,
  PROPOSAL_SUMMARY_STATUS_ABANDONED,
  PROPOSAL_SUMMARY_STATUS_REJECTED,
  AUTHORIZED,
  ACTIVE_VOTE,
  APPROVED,
  REJECTED,
  ARCHIVED,
  UNREVIEWED,
  PUBLIC,
  CENSORED,
  NOJS_ROUTE_PREFIX,
  PROPOSAL_VOTING_REJECTED,
  PROPOSAL_VOTING_INELIGIBLE,
  INELIGIBLE,
  UNAUTHORIZED
} from "src/constants";
import { getTextFromIndexMd, shortRecordToken } from "src/helpers";
import set from "lodash/fp/set";
import values from "lodash/fp/values";
import pick from "lodash/pick";
import isEmpty from "lodash/fp/isEmpty";
import take from "lodash/fp/take";
import takeRight from "lodash/fp/takeRight";
import get from "lodash/fp/get";

/**
 * Returns the total amount of votes received by a given proposal voteSummary
 * @param {Object} voteSummary
 */
export const getVotesReceived = (voteSummary) => {
  if (!voteSummary || !voteSummary.results) {
    return 0;
  }
  return voteSummary.results.reduce(
    (totalVotes, option) => (totalVotes += option.votes),
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
 * @param {number} proposalLinkBy proposal linkBy as seconds unix
 * @param {number} minlinkbyperiod min possible linkby period as seconds unix
 * @returns {Boolean} isRfpReadyToVote
 */
export const isRfpReadyToVote = (proposalLinkBy, minlinkbyperiod) => {
  const currentTimeSec = new Date().getTime() / 1000;
  return Math.round(currentTimeSec + minlinkbyperiod) < proposalLinkBy;
};

/**
 * Returns true if RFP was approved, deadline already expired & RFP submissions
 * didn't vote yet, which means RFP ready to start runoff vote.
 * @param {Object} proposal
 * @param {Object} voteSummary
 * @returns {Boolean} isRfpReadyToRunoff
 */
export const isRfpReadyToRunoff = (
  proposal,
  voteSummary,
  rfpSubmissionsVoteSummaries
) => {
  const isSubmissionsPreVote =
    rfpSubmissionsVoteSummaries &&
    !isEmpty(rfpSubmissionsVoteSummaries) &&
    !Object.values(rfpSubmissionsVoteSummaries).some((vs) =>
      [
        PROPOSAL_VOTING_FINISHED,
        PROPOSAL_VOTING_APPROVED,
        PROPOSAL_VOTING_REJECTED,
        PROPOSAL_VOTING_ACTIVE
      ].includes(vs.status)
    );
  return (
    isApprovedProposal(proposal, voteSummary) &&
    isVotingFinishedProposal(voteSummary) &&
    proposal.linkby &&
    new Date().getTime() / 1000 > Number(proposal.linkby) &&
    isSubmissionsPreVote
  );
};
/**
 * Returns true if the given proposal is unreviewed
 * @param {Object} proposal
 * @returns {Boolean} isUnreviewed
 */
export const isUnreviewedProposal = (proposal) =>
  proposal.status === PROPOSAL_STATUS_UNREVIEWED;
/**
 * Returns true if the given proposal is censored
 * @param {Object} proposal
 * @returns {Boolean} isCensored
 */
export const isCensoredProposal = (proposal) =>
  proposal?.status === PROPOSAL_STATUS_CENSORED;

/**
 * Returns true if the given proposal is public, but voting
 * is not authorized yet.
 * @param {Object} voteSummary
 * @returns {Boolean} isVotingNotAuthorized
 */
export const isVotingNotAuthorizedProposal = (voteSummary) =>
  !!voteSummary && voteSummary.status === PROPOSAL_VOTING_NOT_AUTHORIZED;

/**
 * Returns true if the given proposal is authorized for voting.
 * @param {Object} voteSummary
 * @returns {Boolean} isVotingAuthorized
 */
export const isVotingAuthorizedProposal = (voteSummary) =>
  !!voteSummary && voteSummary.status === PROPOSAL_VOTING_AUTHORIZED;

/**
 * Returns true if the given proposal is public, but voting
 * has finished already
 * @param {Object} voteSummary
 * @returns {Boolean} isVotingFinished
 */
export const isVotingFinishedProposal = (voteSummary) =>
  !!voteSummary &&
  (voteSummary.status === PROPOSAL_VOTING_FINISHED ||
    voteSummary.status === PROPOSAL_VOTING_APPROVED ||
    voteSummary.status === PROPOSAL_VOTING_REJECTED);

/**
 * Returns true if the given proposal is editable
 * @param {Object} proposal
 * @param {Object} voteSummary
 * @returns {Boolean} isEditable
 */
export const isEditableProposal = (proposal, voteSummary) =>
  isUnreviewedProposal(proposal) ||
  (isUnderDiscussionProposal(proposal, voteSummary) &&
    isVotingNotAuthorizedProposal(voteSummary));

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
 * @param {Object} proposalSummary
 * @returns {Boolean} isAbandoned
 */
export const isAbandonedProposal = (proposalSummary) =>
  !!proposalSummary &&
  (proposalSummary.status === PROPOSAL_SUMMARY_STATUS_ABANDONED ||
    proposalSummary.status === PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED);

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
  return voteSummary.status === PROPOSAL_VOTING_APPROVED;
};

/**
 * Returns true if the proposal vote is active
 * @param {Object} voteSummary
 * @returns {Boolean} isVoteActiceProposal
 */
export const isVoteActiveProposal = (voteSummary) =>
  !!voteSummary && voteSummary.status === PROPOSAL_VOTING_ACTIVE;

/**
 * Returns true if the proposal is closed
 * @param {Object} proposalSummary
 * @returns {Boolean} isClosedProposal
 */
export const isClosedProposal = (proposalSummary) =>
  !!proposalSummary &&
  proposalSummary.status === PROPOSAL_SUMMARY_STATUS_CLOSED;

/**
 * Returns true if the proposal is completed
 * @param {Object} proposalSummary
 * @returns {Boolean} isCompletedProposal
 */
export const isCompletedProposal = (proposalSummary) =>
  !!proposalSummary &&
  proposalSummary.status === PROPOSAL_SUMMARY_STATUS_COMPLETED;

/**
 * Returns true if the proposal is active
 * @param {Object} proposalSummary
 * @returns {Boolean} isActiveProposal
 */
export const isActiveProposal = (proposalSummary) =>
  !!proposalSummary &&
  proposalSummary.status === PROPOSAL_SUMMARY_STATUS_ACTIVE;

/**
 * Returns true if the proposal is rejected
 * @param {Object} proposalSummary
 * @returns {Boolean} isRejectedProposal
 */
export const isRejectedProposal = (proposalSummary) =>
  !!proposalSummary &&
  proposalSummary.status === PROPOSAL_SUMMARY_STATUS_REJECTED;

/**
 * Return the amount of blocks left to the end of the voting period
 * @param {Object} voteSummary
 * @param {Number} chainHeight
 * @returns {Number} number of blocks left
 */
export const getVoteBlocksLeft = (voteSummary, chainHeight) => {
  if (!voteSummary) return null;
  const { endblockheight } = voteSummary;
  return +endblockheight - chainHeight;
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
  return markdownFile ? getTextFromIndexMd(markdownFile) : "";
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
    ? `/record/${shortRecordToken(token)}`
    : `${NOJS_ROUTE_PREFIX}/record/${token}`;

/**
 * Retruns the url proposal's comments section using a given token
 * if full token is passed (64 chars hex) then first 7 chars used
 * @param {String} token proposal token
 * @param {boolean} isJsEnabled true if Javascript is enabled
 */
export const getCommentsUrl = (token, isJsEnabled) =>
  isJsEnabled
    ? `/record/${shortRecordToken(token)}?scrollToComments=true`
    : `${NOJS_ROUTE_PREFIX}/record/${token}?scrollToComments=true`;

/**
 * Returns author's account URL
 * @param {String} userid author user id
 * @param {boolean} isJsEnabled true if Javascript is enabled
 */
export const getAuthorUrl = (userid, isJsEnabled) =>
  isJsEnabled ? `/user/${userid}` : `${NOJS_ROUTE_PREFIX}/user/${userid}`;

export const goToFullProposal = (history, proposalURL) => () =>
  history.push(proposalURL);

/**
 * Returns the proposal list with RFP Proposal linked to RFP submissions
 * @param {object} proposalsByToken
 * @param {object} voteSumamries
 * @param {object} proposalSummaries
 */
export const getRfpLinkedProposals = (
  proposalsByToken,
  voteSummaries,
  proposalSummaries
) =>
  values(proposalsByToken).reduce((acc, proposal) => {
    const shortProposalToken = shortRecordToken(getProposalToken(proposal));
    const isRfp = !!proposal.linkby;
    const isSubmission = !!proposal.linkto;
    if (!isSubmission && !isRfp) return acc;
    if (isSubmission) {
      const linkedProposal =
        proposalsByToken[shortRecordToken(proposal.linkto)];
      if (!linkedProposal) return acc;
      return set([shortProposalToken, "proposedFor"], linkedProposal.name)(acc);
    }
    if (isRfp) {
      const linkedFrom =
        proposal.linkedfrom?.map((val) => shortRecordToken(val)) || [];
      const rfpSubmissions = linkedFrom && {
        proposals: values(pick(proposalsByToken, linkedFrom)),
        voteSummaries: pick(voteSummaries, linkedFrom),
        proposalSummaries: pick(proposalSummaries, linkedFrom)
      };
      return {
        ...acc,
        [shortProposalToken]: {
          ...proposal,
          rfpSubmissions
        }
      };
    }
    return acc;
  }, proposalsByToken);

/**
 * Returns a formatted proposal object including the rfp links for the given proposal
 * @param {object} proposal
 * @param {object} rfpSubmissions
 * @param {object} proposals
 */
export const getProposalRfpLinks = (proposal, rfpSubmissions, proposals) => {
  if (!proposal) return;
  const isRfp = !!proposal.linkby;
  const isSubmission = !!proposal.linkto;

  if (!isRfp && !isSubmission) return proposal;
  const hasRfpSubmissions = isRfp && rfpSubmissions;
  const isSubmissionWithProposals = isSubmission && !isEmpty(proposals);
  return hasRfpSubmissions
    ? { ...proposal, rfpSubmissions }
    : isSubmissionWithProposals
    ? {
        ...proposal,
        proposedFor: proposals[shortRecordToken(proposal.linkto)]?.name
      }
    : proposal;
};

export const getProposalStateLabel = (proposalState) =>
  get(proposalState)({
    [PROPOSAL_STATE_VETTED]: "vetted",
    [PROPOSAL_STATE_UNVETTED]: "unvetted"
  });

export const getProposalStatusLabel = (status, isByRecordStatus) =>
  get(status)(
    isByRecordStatus
      ? {
          [PROPOSAL_STATUS_UNREVIEWED]: UNREVIEWED,
          [PROPOSAL_STATUS_ARCHIVED]: ARCHIVED,
          [PROPOSAL_STATUS_CENSORED]: CENSORED,
          [PROPOSAL_STATUS_PUBLIC]: PUBLIC
        }
      : {
          [PROPOSAL_VOTING_NOT_AUTHORIZED]: UNAUTHORIZED,
          [PROPOSAL_VOTING_AUTHORIZED]: AUTHORIZED,
          [PROPOSAL_VOTING_ACTIVE]: ACTIVE_VOTE,
          [PROPOSAL_VOTING_APPROVED]: APPROVED,
          [PROPOSAL_VOTING_REJECTED]: REJECTED,
          [PROPOSAL_VOTING_INELIGIBLE]: INELIGIBLE
        }
  );

export const getProposalLink = (proposal, isJsEnabled) =>
  proposal
    ? getProposalUrl(
        proposal.censorshiprecord?.token,
        isJsEnabled,
        proposal.state
      )
    : "";

/**
 * Returns a [batch, rest] pair given the batch page size from tokens array
 * @param {*} tokens
 * @param {*} pageSize
 */
export const getTokensForProposalsPagination = (tokens, pageSize) => [
  take(pageSize)(tokens),
  takeRight(tokens.length - pageSize)(tokens)
];

/**
 * Returns the proposal tokens by status from an inventory of tokens
 * @param {number[]} statuses
 * @param {boolean} isByRecordStatus
 * @param {Object.<string, string[]>} inventory
 */
export const getRecordsTokensByStatusList = (
  statuses = [],
  isByRecordStatus,
  inventory
) =>
  statuses.reduce((tokens, status) => {
    const label = getProposalStatusLabel(status, isByRecordStatus);
    return [...tokens, ...(inventory[label] || [])];
  }, []);

/**
 * Returns a map of proposals tokens with the key is tab name
 * the tokens are taken from the inventory, filtered by status
 * @param {Object.<string, number[]>} statusByTab
 * @param {Object.<string, string[]>} inventory
 * @param {boolean} isByRecordStatus
 */
export const mapProposalsTokensByTab = (
  statusByTab,
  inventory,
  isByRecordStatus
) =>
  Object.entries(statusByTab).reduce((map, [tab, statuses]) => {
    return {
      ...map,
      [tab]: getRecordsTokensByStatusList(statuses, isByRecordStatus, inventory)
    };
  }, {});
