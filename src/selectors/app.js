import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import qs from "query-string";
import orderBy from "lodash/fp/orderBy";
import { or, constant, not } from "../lib/fp";
import {
  apiProposal,
  apiProposalComments,
  userAlreadyPaid,
  getKeyMismatch,
  apiPropsVoteStatusResponse,
  apiUnvettedProposals,
  apiVettedProposals,
  getPropVoteStatus,
  apiUnvettedStatusResponse,
  numOfUserProposals,
  userid,
  apiUserResponse,
  apiEditUserResponse,
  apiEditUserPayload
} from "./api";
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
  PROPOSAL_USER_FILTER_DRAFT,
  NOTIFICATION_MY_PROPOSAL_STATUS_CHANGE,
  NOTIFICATION_MY_PROPOSAL_VOTE_STARTED,
  NOTIFICATION_ADMIN_PROPOSAL_NEW,
  NOTIFICATION_ADMIN_PROPOSAL_VOTE_AUTHORIZED,
  NOTIFICATION_REGULAR_PROPOSAL_VETTED,
  NOTIFICATION_REGULAR_PROPOSAL_EDITED,
  NOTIFICATION_REGULAR_PROPOSAL_VOTE_STARTED
} from "../constants";
import { getTextFromIndexMd, countPublicProposals } from "../helpers";

export const replyTo = or(get(["app", "replyParent"]), constant(0));

export const proposal = state => {
  const proposal = apiProposal(state) || {};

  return proposal;
};

export const proposalCredits = state => state.app.proposalCredits;

export const getLastSubmittedProposal = state =>
  state.app.submittedProposals.lastSubmitted;
export const newProposalInitialValues = state =>
  state.app.draftProposals.initialValues || {};
export const draftProposals = state =>
  state && state.app && state.app.draftProposals;
export const draftProposalById = state => {
  const drafts = draftProposals(state);
  const { draftid } = qs.parse(window.location.search);
  return (draftid && drafts && drafts[draftid]) || false;
};
export const getUserAlreadyPaid = state => state.app.userAlreadyPaid;
export const getAdminFilterValue = state =>
  parseInt(state.app.adminProposalsShow, 10);
export const getPublicFilterValue = state =>
  parseInt(state.app.publicProposalsShow, 10);
export const getUserFilterValue = state =>
  parseInt(state.app.userProposalsShow, 10);
export const isMarkdown = compose(
  eq("index.md"),
  get("name")
);
export const getProposalFiles = compose(
  get("files"),
  proposal
);
export const getMarkdownFile = compose(
  find(isMarkdown),
  getProposalFiles
);
export const getNotMarkdownFile = compose(
  filter(not(isMarkdown)),
  getProposalFiles
);

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

export const getEditUserValues = state => {
  let myproposalnotifications,
    regularproposalnotifications,
    adminproposalnotifications;

  if (apiEditUserResponse(state)) {
    const editUserPayload = apiEditUserPayload(state);
    myproposalnotifications = editUserPayload.myproposalnotifications;
    regularproposalnotifications = editUserPayload.regularproposalnotifications;
    adminproposalnotifications = editUserPayload.adminproposalnotifications;
  } else {
    const userResponse = apiUserResponse(state) || { user: {} };
    myproposalnotifications = userResponse.user.myproposalnotifications || 0;
    regularproposalnotifications = userResponse.user.regularproposalnotifications || 0;
    adminproposalnotifications = userResponse.user.adminproposalnotifications || 0;
  }

  return {
    "myproposalnotifications-statuschange": !!(myproposalnotifications &
      NOTIFICATION_MY_PROPOSAL_STATUS_CHANGE),
    "myproposalnotifications-votestarted": !!(myproposalnotifications &
      NOTIFICATION_MY_PROPOSAL_VOTE_STARTED),
    "regularproposalnotifications-vetted": !!(regularproposalnotifications &
      NOTIFICATION_REGULAR_PROPOSAL_VETTED),
    "regularproposalnotifications-edited": !!(regularproposalnotifications &
      NOTIFICATION_REGULAR_PROPOSAL_EDITED),
    "regularproposalnotifications-votestarted": !!(regularproposalnotifications &
      NOTIFICATION_REGULAR_PROPOSAL_VOTE_STARTED),
    "adminproposalnotifications-new": !!(adminproposalnotifications &
      NOTIFICATION_ADMIN_PROPOSAL_NEW),
    "adminproposalnotifications-voteauthorized": !!(adminproposalnotifications &
      NOTIFICATION_ADMIN_PROPOSAL_VOTE_AUTHORIZED)
  };
};

export const resolveEditUserValues = prefs => {
  return {
    myproposalnotifications: (
      prefs["myproposalnotifications-statuschange"] ? NOTIFICATION_MY_PROPOSAL_STATUS_CHANGE : 0
    ) | (
      prefs["myproposalnotifications-votestarted"] ? NOTIFICATION_MY_PROPOSAL_VOTE_STARTED : 0
    ),
    regularproposalnotifications: (
      prefs["regularproposalnotifications-vetted"] ? NOTIFICATION_REGULAR_PROPOSAL_VETTED : 0
    ) | (
      prefs["regularproposalnotifications-edited"] ? NOTIFICATION_REGULAR_PROPOSAL_EDITED : 0
    ) | (
      prefs["regularproposalnotifications-votestarted"] ? NOTIFICATION_REGULAR_PROPOSAL_VOTE_STARTED : 0
    ),
    adminproposalnotifications: (
      prefs["adminproposalnotifications-new"] ? NOTIFICATION_ADMIN_PROPOSAL_NEW : 0
    ) | (
      prefs["adminproposalnotifications-voteauthorized"] ? NOTIFICATION_ADMIN_PROPOSAL_VOTE_AUTHORIZED : 0
    )
  };
};

export const getUserPaywallStatus = state => {
  if (userAlreadyPaid(state)) {
    return PAYWALL_STATUS_PAID;
  }

  return state.app.userPaywallStatus || PAYWALL_STATUS_WAITING;
};
export const getUserPaywallConfirmations = state => {
  if (userAlreadyPaid(state)) {
    return null;
  }
  return state.app.userPaywallConfirmations;
};

export const getUserPaywallTxid = state => {
  if (userAlreadyPaid(state)) {
    return null;
  }
  return state.app.userPaywallTxid;
};

export const userHasPaid = state => {
  return getUserPaywallStatus(state) === PAYWALL_STATUS_PAID;
};
export const userCanExecuteActions = state => {
  return userHasPaid(state) && !getKeyMismatch(state);
};

export const isProposalStatusApproved = state =>
  state.app.isProposalStatusApproved;
export const activeVotesEndHeight = state => state.app.activeVotesEndHeight;

export const proposalComments = state => apiProposalComments(state);

export const getTempThreadTree = state => state.app.replyThreadTree;

export const unvettedProposals = state => {
  const unvettedProposals = apiUnvettedProposals(state);
  return unvettedProposals;
};

export const vettedProposals = state => {
  const vettedProposals = apiVettedProposals(state);
  return vettedProposals;
};

export const getUnvettedFilteredProposals = state => {
  const filterValue = getAdminFilterValue(state);
  const proposals = unvettedProposals(state);

  if (!filterValue) {
    return proposals;
  }

  return proposals
    .filter(proposal => {
      // alow propos with status of unreviewed changes be filtered along with general unreviewed props
      if (
        proposal.status === PROPOSAL_STATUS_UNREVIEWED_CHANGES &&
        filterValue === PROPOSAL_STATUS_UNREVIEWED
      ) {
        return true;
      }
      return filterValue === proposal.status;
    })
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const getVettedFilteredProposals = state => {
  const vettedProps = vettedProposals(state);
  const filterValue = getPublicFilterValue(state);
  if (!filterValue) return vettedProps;
  return vettedProps
    .filter(prop => {
      const propVoteStatus = getPropVoteStatus(state)(
        prop.censorshiprecord.token
      ).status;
      if (
        filterValue === PROPOSAL_VOTING_NOT_AUTHORIZED &&
        propVoteStatus === PROPOSAL_VOTING_AUTHORIZED
      ) {
        return true;
      }
      return (
        filterValue ===
        getPropVoteStatus(state)(prop.censorshiprecord.token).status
      );
    })
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const getDraftProposals = state => {
  const draftsObj = draftProposals(state) || {};
  const drafts = Object.keys(draftsObj)
    .filter(
      key => ["newDraft", "lastSubmitted", "originalName"].indexOf(key) === -1
    )
    .map(key => draftsObj[key]);
  return drafts;
};

export const getSubmittedUserProposals = state => userID => {
  const isUserProp = prop => prop.userid === userID;
  const vettedProps = vettedProposals(state).filter(isUserProp);
  const unvettedProps = unvettedProposals(state).filter(isUserProp);

  const sortByNewestFirst = orderBy(["timestamp"], ["desc"]);

  return sortByNewestFirst(vettedProps.concat(unvettedProps));
};

export const getUserProposals = state => {
  const userFilterValue = getUserFilterValue(state);
  const userID = userid(state);

  if (userFilterValue === PROPOSAL_USER_FILTER_SUBMITTED) {
    return getSubmittedUserProposals(state)(userID);
  } else if (userFilterValue === PROPOSAL_USER_FILTER_DRAFT) {
    return getDraftProposals(state);
  }

  return [];
};

export const getUserProposalFilterCounts = state => {
  const proposalFilterCounts = {
    [PROPOSAL_USER_FILTER_SUBMITTED]: numOfUserProposals(state),
    [PROPOSAL_USER_FILTER_DRAFT]: getDraftProposals(state).length
  };

  proposalFilterCounts[PROPOSAL_FILTER_ALL] = Object.keys(
    proposalFilterCounts
  ).reduce((total, filterValue) => total + proposalFilterCounts[filterValue]);

  return proposalFilterCounts;
};

export const getUnvettedProposalFilterCounts = state => {
  const usResponse = apiUnvettedStatusResponse(state);
  return usResponse
    ? {
        [PROPOSAL_STATUS_UNREVIEWED]:
          usResponse.numofunvetted + usResponse.numofunvettedchanges,
        [PROPOSAL_STATUS_CENSORED]: usResponse.numofcensored,
        [PROPOSAL_FILTER_ALL]:
          usResponse.numofunvetted +
          usResponse.numofunvettedchanges +
          usResponse.numofcensored
      }
    : {};
};

export const getVettedProposalFilterCounts = state => {
  const vsResponse = apiPropsVoteStatusResponse(state);
  return vsResponse ? countPublicProposals(vsResponse.votesstatus) : {};
};

export const getUnvettedEmptyProposalsMessage = state => {
  switch (getAdminFilterValue(state)) {
    case PROPOSAL_STATUS_UNREVIEWED:
      return "There are no proposals to review";
    case PROPOSAL_STATUS_CENSORED:
      return "There are no censored proposals, yay!";
    default:
      return "There are no unvetted proposals";
  }
};

export const getVettedEmptyProposalsMessage = state => {
  switch (getPublicFilterValue(state)) {
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

export const votesEndHeight = state => state.app.votesEndHeight || {};

export const getCsrfIsNeeded = state =>
  state.app ? state.app.csrfIsNeeded : null;

export const isShowingSignupConfirmation = state =>
  state.app.isShowingSignupConfirmation;

export const shouldAutoVerifyKey = state => state.app.shouldVerifyKey;

export const identityImportError = state =>
  state.app.identityImportResult && state.app.identityImportResult.errorMsg;

export const identityImportSuccess = state =>
  state.app.identityImportResult && state.app.identityImportResult.successMsg;

export const onboardViewed = state => state.app.onboardViewed;

export const commentsSortOption = state => state.app.commentsSortOption;

export const pollingCreditsPayment = state => state.app.pollingCreditsPayment;

export const proposalPaymentReceived = state =>
  state.app.proposalPaymentReceived;

export const redirectedFrom = state => state.app.redirectedFrom;
