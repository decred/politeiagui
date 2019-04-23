import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import orderBy from "lodash/fp/orderBy";
import { or, constant, not } from "../lib/fp";
import qs from "query-string";
import {
  apiProposal,
  apiInvoice,
  apiProposalComments,
  apiInvoiceComments,
  userAlreadyPaid,
  getKeyMismatch,
  apiPropsVoteStatusResponse,
  apiUnvettedProposals,
  apiVettedProposals,
  apiUserInvoices,
  getPropVoteStatus,
  apiUnvettedStatusResponse,
  numOfUserProposals,
  userid,
  apiUserResponse,
  apiEditUserResponse,
  apiEditUserPayload,
  isCMS,
  apiAdminInvoices
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
  PROPOSAL_APPROVED,
  PROPOSAL_REJECTED,
  INVOICE_STATUS_NEW,
  INVOICE_STATUS_UPDATED,
  INVOICE_STATUS_REJECTED,
  INVOICE_STATUS_APPROVED,
  INVOICE_STATUS_PAID,
  NOTIFICATION_EMAIL_MY_PROPOSAL_STATUS_CHANGE,
  NOTIFICATION_EMAIL_MY_PROPOSAL_VOTE_STARTED,
  NOTIFICATION_EMAIL_ADMIN_PROPOSAL_NEW,
  NOTIFICATION_EMAIL_ADMIN_PROPOSAL_VOTE_AUTHORIZED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VETTED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_EDITED,
  NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VOTE_STARTED,
  NOTIFICATION_EMAIL_COMMENT_ON_MY_PROPOSAL,
  NOTIFICATION_EMAIL_COMMENT_ON_MY_COMMENT,
  PROPOSAL_STATUS_ABANDONED,
  CMS_PAYWALL_STATUS,
  INVOICE_FILTER_ALL,
  INVOICE_STATUS_DISPUTED,
  FILTER_ALL_MONTHS
} from "../constants";
import {
  getTextFromIndexMd,
  countPublicProposals,
  isProposalApproved,
  getCurrentYear
} from "../helpers";

export const replyTo = or(get(["app", "replyParent"]), constant(0));

export const proposal = state => {
  const proposal = apiProposal(state) || {};

  return proposal;
};

export const invoice = state => {
  const invoice = apiInvoice(state) || {};

  return invoice;
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
export const getMonthFilterValue = state =>
  state.app.invoiceSortOption &&
  parseInt(state.app.invoiceSortOption.month, 10);
export const getYearFilterValue = state =>
  state.app.invoiceSortOption && parseInt(state.app.invoiceSortOption.year, 10);
export const isMarkdown = compose(
  eq("index.md"),
  get("name")
);
export const isJSON = compose(
  eq("invoice.json"),
  get("name")
);
export const getProposalFiles = compose(
  get("files"),
  proposal
);
export const getInvoiceFiles = compose(
  get("file"),
  invoice
);
export const getMarkdownFile = compose(
  find(isMarkdown),
  getProposalFiles
);
export const getNotMarkdownFile = compose(
  filter(not(isMarkdown)),
  getProposalFiles
);
export const getInvoiceJSON = compose(
  find(isJSON),
  getInvoiceFiles
);
export const getNotJSONFile = compose(
  filter(not(isJSON)),
  getInvoiceFiles
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
  let emailNotifications;

  if (apiEditUserResponse(state)) {
    const editUserPayload = apiEditUserPayload(state);
    emailNotifications = editUserPayload.emailnotifications;
  } else {
    const userResponse = apiUserResponse(state) || { user: {} };
    emailNotifications = userResponse.user.emailnotifications || 0;
  }

  return {
    "myproposalnotifications-statuschange": !!(
      emailNotifications & NOTIFICATION_EMAIL_MY_PROPOSAL_STATUS_CHANGE
    ),
    "myproposalnotifications-votestarted": !!(
      emailNotifications & NOTIFICATION_EMAIL_MY_PROPOSAL_VOTE_STARTED
    ),
    "regularproposalnotifications-vetted": !!(
      emailNotifications & NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VETTED
    ),
    "regularproposalnotifications-edited": !!(
      emailNotifications & NOTIFICATION_EMAIL_REGULAR_PROPOSAL_EDITED
    ),
    "regularproposalnotifications-votestarted": !!(
      emailNotifications & NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VOTE_STARTED
    ),
    "adminproposalnotifications-new": !!(
      emailNotifications & NOTIFICATION_EMAIL_ADMIN_PROPOSAL_NEW
    ),
    "adminproposalnotifications-voteauthorized": !!(
      emailNotifications & NOTIFICATION_EMAIL_ADMIN_PROPOSAL_VOTE_AUTHORIZED
    ),
    "commentnotifications-proposal": !!(
      emailNotifications & NOTIFICATION_EMAIL_COMMENT_ON_MY_PROPOSAL
    ),
    "commentnotifications-comment": !!(
      emailNotifications & NOTIFICATION_EMAIL_COMMENT_ON_MY_COMMENT
    )
  };
};

export const resolveEditUserValues = prefs => {
  return {
    emailnotifications:
      (prefs["myproposalnotifications-statuschange"]
        ? NOTIFICATION_EMAIL_MY_PROPOSAL_STATUS_CHANGE
        : 0) |
      (prefs["myproposalnotifications-votestarted"]
        ? NOTIFICATION_EMAIL_MY_PROPOSAL_VOTE_STARTED
        : 0) |
      (prefs["regularproposalnotifications-vetted"]
        ? NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VETTED
        : 0) |
      (prefs["regularproposalnotifications-edited"]
        ? NOTIFICATION_EMAIL_REGULAR_PROPOSAL_EDITED
        : 0) |
      (prefs["regularproposalnotifications-votestarted"]
        ? NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VOTE_STARTED
        : 0) |
      (prefs["adminproposalnotifications-new"]
        ? NOTIFICATION_EMAIL_ADMIN_PROPOSAL_NEW
        : 0) |
      (prefs["adminproposalnotifications-voteauthorized"]
        ? NOTIFICATION_EMAIL_ADMIN_PROPOSAL_VOTE_AUTHORIZED
        : 0) |
      (prefs["commentnotifications-proposal"]
        ? NOTIFICATION_EMAIL_COMMENT_ON_MY_PROPOSAL
        : 0) |
      (prefs["commentnotifications-comment"]
        ? NOTIFICATION_EMAIL_COMMENT_ON_MY_COMMENT
        : 0)
  };
};

export const getUserPaywallStatus = state => {
  if (isCMS(state)) return CMS_PAYWALL_STATUS;
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

export const invoiceComments = state => apiInvoiceComments(state);

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
      const propVote = getPropVoteStatus(state)(prop.censorshiprecord.token);

      // the filter value used for all proposals on pre-voting is PROPOSAL_VOTING_NOT_AUTHORIZED however proposals with authorized voting should also be included
      const filterForPreVoting = filterValue === PROPOSAL_VOTING_NOT_AUTHORIZED;
      const propIsVotingAuthorized =
        propVoteStatus === PROPOSAL_VOTING_AUTHORIZED;
      if (filterForPreVoting && propIsVotingAuthorized) {
        return true;
      }

      // proposals approved and rejected should be handled
      const filterForApproved = filterValue === PROPOSAL_APPROVED;
      const propIsApproved =
        propVoteStatus === PROPOSAL_VOTING_FINISHED &&
        isProposalApproved(propVote);
      if (filterForApproved && propIsApproved) {
        return true;
      }

      const filterForRejected = filterValue === PROPOSAL_REJECTED;
      const propIsRejected =
        propVoteStatus === PROPOSAL_VOTING_FINISHED &&
        !isProposalApproved(propVote);
      if (filterForRejected && propIsRejected) {
        return true;
      }

      // the proposals under the abandoned tab are classified by their regular status and NOT by their voting status, so is necessary a special conditional to handle this corner case
      const filterForAbandoned = filterValue === PROPOSAL_STATUS_ABANDONED;
      const propIsAbandoned = prop.status === PROPOSAL_STATUS_ABANDONED;
      if (filterForAbandoned && propIsAbandoned) {
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

// TODO: call getUserInvoicesCountByStatus
export const getUserInvoicesFilterCounts = state => {
  let invoices = apiUserInvoices(state);
  const { month, year } = state.app.invoiceSortOption;
  if (month !== FILTER_ALL_MONTHS) {
    invoices = getInvoicesByMonth(getInvoicesByYear(invoices, year), month);
  }
  return getInvoicesCountByStatus(invoices);
};

export const getAdminInvoicesCountByStatus = state => {
  let invoices = apiAdminInvoices(state);
  const { month, year } = state.app.invoiceSortOption;
  if (month !== FILTER_ALL_MONTHS) {
    invoices = getInvoicesByMonth(getInvoicesByYear(invoices, year), month);
  }
  return getInvoicesCountByStatus(invoices);
};

export const getInvoicesCountByStatus = invoices => {
  return invoices
    ? {
        [INVOICE_STATUS_NEW]: getInvoicesByStatus(invoices, INVOICE_STATUS_NEW)
          .length,
        [INVOICE_STATUS_UPDATED]: getInvoicesByStatus(
          invoices,
          INVOICE_STATUS_UPDATED
        ).length,
        [INVOICE_STATUS_REJECTED]: getInvoicesByStatus(
          invoices,
          INVOICE_STATUS_REJECTED
        ).length,
        [INVOICE_STATUS_APPROVED]: getInvoicesByStatus(
          invoices,
          INVOICE_STATUS_APPROVED
        ).length,
        [INVOICE_STATUS_DISPUTED]: getInvoicesByStatus(
          invoices,
          INVOICE_STATUS_DISPUTED
        ).length,
        [INVOICE_STATUS_PAID]: getInvoicesByStatus(
          invoices,
          INVOICE_STATUS_PAID
        ).length,
        [INVOICE_FILTER_ALL]: invoices.length
      }
    : 0;
};

const getInvoicesByStatus = (invoices, status) =>
  status === INVOICE_FILTER_ALL
    ? invoices
    : invoices.filter(i => i.status === status);

const getInvoicesByYear = (invoices, year) =>
  year === getCurrentYear()
    ? invoices
    : invoices.filter(i => i.input.year === year);

const getInvoicesByMonth = (invoices = [], month) =>
  month === FILTER_ALL_MONTHS
    ? invoices
    : invoices.filter(i => i.input.month === month);

export const getAdminInvoices = state => {
  const invoices = apiAdminInvoices(state);
  const adminFilterValue = getAdminFilterValue(state);
  const monthFilter = getMonthFilterValue(state);
  const yearFilter = getYearFilterValue(state);

  if (!invoices) return [];

  const invoicesByStatus = getInvoicesByStatus(invoices, adminFilterValue);
  const invoicesByYear = getInvoicesByYear(invoicesByStatus, yearFilter);
  const invoicesByMonth = getInvoicesByMonth(invoicesByYear, monthFilter);

  return invoicesByStatus && invoicesByYear && invoicesByMonth;
};

export const getUserInvoices = state => {
  const invoices = apiUserInvoices(state);
  const userFilterValue = getUserFilterValue(state);
  const monthFilter = getMonthFilterValue(state);
  const yearFilter = getYearFilterValue(state);

  if (!invoices) return [];

  const invoicesByStatus = getInvoicesByStatus(invoices, userFilterValue);
  const invoicesByYear = getInvoicesByYear(invoicesByStatus, yearFilter);
  const invoicesByMonth = getInvoicesByMonth(invoicesByYear, monthFilter);

  return invoicesByStatus && invoicesByYear && invoicesByMonth;
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

const countAbandonedProposals = (proposals = []) =>
  proposals.filter(p => p.status === PROPOSAL_STATUS_ABANDONED).length;

const countApprovedProps = (votesstatus = []) =>
  votesstatus.filter(vs => {
    if (vs.status === PROPOSAL_VOTING_FINISHED) {
      return isProposalApproved(vs);
    }
    return false;
  }).length;

const countRejectedProps = (votesstatus = []) =>
  votesstatus.filter(vs => {
    if (vs.status === PROPOSAL_VOTING_FINISHED) {
      return !isProposalApproved(vs);
    }
    return false;
  }).length;

export const getVettedProposalFilterCounts = state => {
  if (isCMS(state))
    return {
      [PROPOSAL_STATUS_ABANDONED]: 0,
      [PROPOSAL_APPROVED]: 0,
      [PROPOSAL_REJECTED]: 0
    };
  const vsResponse = apiPropsVoteStatusResponse(state);
  const vettedProps = apiVettedProposals(state);
  const count = vsResponse ? countPublicProposals(vsResponse.votesstatus) : {};

  // abandoned proposals has to be counted separately because it's counting  is not based on its voting status
  const countOfAbandonedProps = countAbandonedProposals(vettedProps);

  // add the amount of abandoned props to the total num of proposals
  count[PROPOSAL_FILTER_ALL] += countOfAbandonedProps;

  // approved and rejected proposals
  const countOfApprovedProps = vsResponse
    ? countApprovedProps(vsResponse.votesstatus)
    : 0;
  const countOfRejectedProps = vsResponse
    ? countRejectedProps(vsResponse.votesstatus)
    : 0;
  return {
    ...count,
    [PROPOSAL_STATUS_ABANDONED]: countOfAbandonedProps,
    [PROPOSAL_APPROVED]: countOfApprovedProps,
    [PROPOSAL_REJECTED]: countOfRejectedProps
  };
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
    case PROPOSAL_VOTING_NOT_AUTHORIZED:
      return "There are no pre-voting proposals";
    case PROPOSAL_REJECTED:
      return "There are no rejected proposals";
    case PROPOSAL_APPROVED:
      return "There are no approved proposals";
    case PROPOSAL_STATUS_ABANDONED:
      return "There are no abandoned proposals";
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
