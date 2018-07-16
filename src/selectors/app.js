import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import { or, constant, not } from "../lib/fp";
import {
  apiProposal,
  apiProposalComments,
  proposalPayload,
  userAlreadyPaid,
  getKeyMismatch,
  apiUnvettedProposals,
  apiVettedProposals,
  getPropVoteStatus
} from "./api";
import { globalUsernamesById } from "../actions/app";
import { PAYWALL_STATUS_PAID, PAYWALL_STATUS_WAITING, PROPOSAL_FILTER_ALL, PROPOSAL_STATUS_UNREVIEWED, PROPOSAL_STATUS_CENSORED, PROPOSAL_VOTING_ACTIVE, PROPOSAL_VOTING_FINISHED, PROPOSAL_VOTING_NOT_STARTED } from "../constants";

export const replyTo = or(get(["app", "replyParent"]), constant(0));

export const proposal = state => {
  const payload = proposalPayload(state);
  const submittedProposals = state.app.submittedProposals;
  let proposal = submittedProposals[payload] || apiProposal(state) || {};

  // Cache the username for the proposal author.
  if(proposal.userid) {
    globalUsernamesById[proposal.userid] = proposal.username;
  }

  return proposal;
};

export const getLastSubmittedProposal = state => state.app.submittedProposals.lastSubmitted;
export const getAdminFilterValue = state => parseInt(state.app.adminProposalsShow, 10);
export const getPublicFilterValue = state =>  parseInt(state.app.publicProposalsShow, 10);
export const isMarkdown = compose(eq("index.md"), get("name"));
export const getProposalFiles = compose(get("files"), proposal);
export const getMarkdownFile = compose(find((isMarkdown)), getProposalFiles);
export const getNotMarkdownFile = compose(filter(not(isMarkdown)), getProposalFiles);

export const getUserPaywallStatus = state => {
  if(userAlreadyPaid(state)) {
    return PAYWALL_STATUS_PAID;
  }

  return state.app.userPaywallStatus || PAYWALL_STATUS_WAITING;
};
export const getUserPaywallConfirmations = state => {
  if(userAlreadyPaid(state)) {
    return null;
  }
  return state.app.userPaywallConfirmations;
};

export const userHasPaid = state => {
  return getUserPaywallStatus(state) === PAYWALL_STATUS_PAID;
};
export const userCanExecuteActions = state => {
  return userHasPaid(state) && !getKeyMismatch(state);
};

export const isProposalStatusApproved = state => state.app.isProposalStatusApproved;
export const activeVotesEndHeight = state => state.app.activeVotesEndHeight;

export const proposalComments = state => {
  let comments = apiProposalComments(state);
  for(let comment of comments) {
    if(comment.userid in globalUsernamesById) {
      comment.username = globalUsernamesById[comment.userid];
    }
  }

  return comments;
};

export const unvettedProposals = state => {
  let unvettedProposals = apiUnvettedProposals(state);
  if(unvettedProposals) {
    for(let proposal of unvettedProposals) {
      globalUsernamesById[proposal.userid] = proposal.username;
    }
  }
  return unvettedProposals;
};

export const vettedProposals = state => {
  let vettedProposals = apiVettedProposals(state);
  if(vettedProposals) {
    for(let proposal of vettedProposals) {
      globalUsernamesById[proposal.userid] = proposal.username;
    }
  }
  return vettedProposals;
};

export const getUnvettedFilteredProposals = (state) => {
  let filterValue = getAdminFilterValue(state);
  let proposals = unvettedProposals(state);

  if(!filterValue) {
    return proposals;
  }
  return proposals.filter(proposal => proposal.status === filterValue);
};

export const getVettedFilteredProposals = (state) => {
  const vettedProps = vettedProposals(state);
  const filterValue = getPublicFilterValue(state);
  if (!filterValue)
    return vettedProps;
  return vettedProps.filter(prop => {
    return filterValue === getPropVoteStatus(state)(prop.censorshiprecord.token).status;
  });
};

export const getUnvettedProposalFilterCounts = (state) => {
  let proposals = unvettedProposals(state);
  let proposalFilterCounts = {};

  proposals.forEach(proposal => {
    proposalFilterCounts[proposal.status] = 1 + (proposalFilterCounts[proposal.status] || 0);
  });
  proposalFilterCounts[PROPOSAL_FILTER_ALL] = proposals.length;

  return proposalFilterCounts;
};

export const getVettedProposalFilterCounts = (state) => {
  let proposals = vettedProposals(state);
  let proposalFilterCounts = {};

  proposals.forEach(proposal => {
    let propVoteStatus = getPropVoteStatus(state)(proposal.censorshiprecord.token);
    let status = propVoteStatus.status;
    proposalFilterCounts[status] = 1 + (proposalFilterCounts[status] || 0);
  });
  proposalFilterCounts[PROPOSAL_FILTER_ALL] = proposals.length;

  return proposalFilterCounts;
};

export const getUnvettedEmptyProposalsMessage = (state) => {
  switch(getAdminFilterValue(state)) {
  case PROPOSAL_STATUS_UNREVIEWED:
    return "There are no proposals to review";
  case PROPOSAL_STATUS_CENSORED:
    return "There are no censored proposals, yay!";
  default:
    return "There are no unvetted proposals";
  }
};

export const getVettedEmptyProposalsMessage = (state) => {
  switch(getPublicFilterValue(state)) {
  case PROPOSAL_VOTING_ACTIVE:
    return "There are no proposals being actively voted on";
  case PROPOSAL_VOTING_FINISHED:
    return "There are no proposals that have finished voting";
  case PROPOSAL_VOTING_NOT_STARTED:
    return "There are no pre-voting proposals";
  default:
    return "There are no proposals";
  }
};

export const votesEndHeight = (state) => state.app.votesEndHeight || {};

export const getCsrfIsNeeded = state => state.app ? state.app.csrfIsNeeded : null;

export const isShowingSignupConfirmation = state => state.app.isShowingSignupConfirmation;

export const shouldAutoVerifyKey = (state) => state.app.shouldVerifyKey;
