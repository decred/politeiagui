import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import qs from "query-string";
import { or, constant, not } from "../lib/fp";
import {
  apiProposal,
  apiProposalComments,
  userAlreadyPaid,
  getKeyMismatch,
  apiUnvettedProposals,
  apiVettedProposals,
  getPropVoteStatus,
  apiUserProposals
} from "./api";
import { globalUsernamesById } from "../actions/app";
import {
  PAYWALL_STATUS_PAID,
  PAYWALL_STATUS_WAITING,
  PROPOSAL_FILTER_ALL,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_FINISHED,
  PROPOSAL_USER_FILTER_SUBMITTED,
  PROPOSAL_USER_FILTER_DRAFT
} from "../constants";
import { getTextFromIndexMd } from "../helpers";

export const replyTo = or(get([ "app", "replyParent" ]), constant(0));

export const proposal = state => {
  const proposal =  apiProposal(state) || {};

  // Cache the username for the proposal author.
  if(proposal.userid) {
    globalUsernamesById[proposal.userid] = proposal.username;
  }

  return proposal;
};

export const proposalCredits = state => state.app.proposalCredits;

export const getLastSubmittedProposal = state => state.app.submittedProposals.lastSubmitted;
export const newProposalInitialValues = state => state.app.draftProposals.initialValues || {};
export const draftProposals = state => state && state.app && state.app.draftProposals;
export const draftProposalById = state => {
  const drafts = draftProposals(state);
  const { draftid } = qs.parse(window.location.search);
  return (draftid && drafts && drafts[draftid]) || false;
};
export const getAdminFilterValue = state => parseInt(state.app.adminProposalsShow, 10);
export const getPublicFilterValue = state =>  parseInt(state.app.publicProposalsShow, 10);
export const getUserFilterValue = state =>  parseInt(state.app.userProposalsShow, 10);
export const isMarkdown = compose(eq("index.md"), get("name"));
export const getProposalFiles = compose(get("files"), proposal);
export const getMarkdownFile = compose(find((isMarkdown)), getProposalFiles);
export const getNotMarkdownFile = compose(filter(not(isMarkdown)), getProposalFiles);

export const getEditProposalValues = state => {
  const { name } = proposal(state);

  const files = name ? getNotMarkdownFile(state) : [];
  const description = name ? getTextFromIndexMd(getMarkdownFile(state)) : "";
  return {
    name,
    description,
    files
  };
};

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
  return !getKeyMismatch(state);
};

export const isProposalStatusApproved = state => state.app.isProposalStatusApproved;
export const activeVotesEndHeight = state => state.app.activeVotesEndHeight;

export const proposalComments = state => {
  const comments = apiProposalComments(state);
  for(const comment of comments) {
    if(comment.userid in globalUsernamesById) {
      comment.username = globalUsernamesById[comment.userid];
    }
  }

  return comments;
};

export const unvettedProposals = state => {
  const unvettedProposals = apiUnvettedProposals(state);
  if(unvettedProposals) {
    for(const proposal of unvettedProposals) {
      globalUsernamesById[proposal.userid] = proposal.username;
    }
  }
  return unvettedProposals;
};

export const vettedProposals = state => {
  const vettedProposals = apiVettedProposals(state);
  if(vettedProposals) {
    for(const proposal of vettedProposals) {
      globalUsernamesById[proposal.userid] = proposal.username;
    }
  }
  return vettedProposals;
};

export const getUnvettedFilteredProposals = (state) => {
  const filterValue = getAdminFilterValue(state);
  const proposals = unvettedProposals(state);

  if(!filterValue) {
    return proposals;
  }

  return proposals.filter(proposal => {
    // alow propos with status of unreviewed changes be filtered along with general unreviewed props
    if(proposal.status === PROPOSAL_STATUS_UNREVIEWED_CHANGES && filterValue === PROPOSAL_STATUS_UNREVIEWED) {
      return true;
    }
    return filterValue === proposal.status;
  });
};

export const getVettedFilteredProposals = (state) => {
  const vettedProps = vettedProposals(state);
  const filterValue = getPublicFilterValue(state);
  if (!filterValue)
    return vettedProps;
  return vettedProps.filter(prop => {
    const propVoteStatus = getPropVoteStatus(state)(prop.censorshiprecord.token).status;
    if (filterValue === PROPOSAL_VOTING_NOT_AUTHORIZED && propVoteStatus === PROPOSAL_VOTING_AUTHORIZED) {
      return true;
    }
    return filterValue === getPropVoteStatus(state)(prop.censorshiprecord.token).status;
  });
};

export const getDraftProposals = (state) => {
  const draftsObj = draftProposals(state) || {};
  const drafts = Object.keys(draftsObj)
    .filter(key =>
      [ "newDraft", "lastSubmitted", "originalName" ].indexOf(key) === -1
    )
    .map(key => draftsObj[key]);
  return drafts;
};

export const getUserProposals = (state) => {
  const userFilterValue = getUserFilterValue(state);
  if (userFilterValue === PROPOSAL_USER_FILTER_SUBMITTED) {
    return apiUserProposals(state);
  } else if (userFilterValue === PROPOSAL_USER_FILTER_DRAFT) {
    return getDraftProposals(state);
  }

  return [];
};

export const getUserProposalFilterCounts = (state) => {
  const proposalFilterCounts = {
    [PROPOSAL_USER_FILTER_SUBMITTED]: apiUserProposals(state).length,
    [PROPOSAL_USER_FILTER_DRAFT]: getDraftProposals(state).length
  };

  proposalFilterCounts[PROPOSAL_FILTER_ALL] =
    Object.keys(proposalFilterCounts).reduce((total, filterValue) =>
      total + proposalFilterCounts[filterValue]);

  return proposalFilterCounts;
};

export const getUnvettedProposalFilterCounts = (state) => {
  const proposals = unvettedProposals(state);
  const proposalFilterCounts = {};

  proposals.forEach(proposal => {
    proposalFilterCounts[proposal.status] = 1 + (proposalFilterCounts[proposal.status] || 0);
  });
  proposalFilterCounts[PROPOSAL_FILTER_ALL] = proposals.length;

  return proposalFilterCounts;
};

export const getVettedProposalFilterCounts = (state) => {
  const proposals = vettedProposals(state);
  const proposalFilterCounts = {};

  proposals.forEach(proposal => {
    const propVoteStatus = getPropVoteStatus(state)(proposal.censorshiprecord.token);
    const status = propVoteStatus.status;
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
  case PROPOSAL_VOTING_NOT_AUTHORIZED:
    return "There are no pre-voting proposals";
  default:
    return "There are no proposals";
  }
};

export const votesEndHeight = (state) => state.app.votesEndHeight || {};

export const getCsrfIsNeeded = state => state.app ? state.app.csrfIsNeeded : null;

export const isShowingSignupConfirmation = state => state.app.isShowingSignupConfirmation;

export const shouldAutoVerifyKey = (state) => state.app.shouldVerifyKey;

export const identityImportError = (state) => state.app.identityImportResult && state.app.identityImportResult.errorMsg;

export const identityImportSuccess = (state) => state.app.identityImportResult && state.app.identityImportResult.successMsg;

export const onboardViewed = (state) => state.app.onboardViewed;

export const commentsSortOption = (state) => state.app.commentsSortOption;
