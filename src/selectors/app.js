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
  userAlreadyPaid,
  getKeyMismatch,
  apiUnvettedProposals,
  apiVettedProposals,
  apiUserInvoices,
  getPropVoteStatus,
  isCMS,
  apiAdminInvoices,
  apiDCCComments
} from "./api";
import {
  PAYWALL_STATUS_PAID,
  PAYWALL_STATUS_WAITING,
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
  CMS_PAYWALL_STATUS,
  INVOICE_FILTER_ALL,
  INVOICE_STATUS_DISPUTED,
  FILTER_ALL_MONTHS,
  PROPOSAL_USER_FILTER_DRAFT_INVOICES
} from "../constants";
import { getCurrentYear } from "../helpers";

export const replyTo = or(get(["app", "replyParent"]), constant(0));

export const proposal = (state) => {
  const proposal = apiProposal(state) || {};

  return proposal;
};

export const invoice = (state) => {
  const invoice = apiInvoice(state) || {};

  return invoice;
};

export const proposalCredits = (state) => state.app.proposalCredits;

export const draftProposals = (state) =>
  state && state.app && state.app.draftProposals;

export const draftInvoices = (state) =>
  state && state.app && state.app.draftInvoices;
export const draftInvoiceById = (state) => {
  const drafts = draftInvoices(state);
  const { draftid } = qs.parse(window.location.search);
  return (draftid && drafts && drafts[draftid]) || false;
};
export const getUserAlreadyPaid = (state) => state.app.userAlreadyPaid;
export const getAdminFilterValue = (state) =>
  parseInt(state.app.adminProposalsShow, 10);
export const draftDCCs = (state) => state && state.app && state.app.draftDCCs;
export const getPublicFilterValue = (state) =>
  parseInt(state.app.publicProposalsShow, 10);
export const getUserFilterValue = (state) =>
  parseInt(state.app.userProposalsShow, 10);
export const getStartMonthPayoutFilterValue = (state) =>
  state.app.startPayoutOption &&
  parseInt(state.app.startPayoutOption.month, 10);
export const getEndMonthPayoutFilterValue = (state) =>
  state.app.endPayoutOption && parseInt(state.app.endPayoutOption.month, 10);
export const getStartYearPayoutFilterValue = (state) =>
  state.app.startPayoutOption && parseInt(state.app.startPayoutOption.year, 10);
export const getEndYearPayoutFilterValue = (state) =>
  state.app.endPayoutOption && parseInt(state.app.endPayoutOption.year, 10);
export const getMonthFilterValue = (state) =>
  state.app.invoiceSortOption &&
  parseInt(state.app.invoiceSortOption.month, 10);
export const getYearFilterValue = (state) =>
  state.app.invoiceSortOption && parseInt(state.app.invoiceSortOption.year, 10);
export const isMarkdown = compose(eq("index.md"), get("name"));
export const isJSON = compose(eq("invoice.json"), get("name"));
export const getProposalFiles = compose(get("files"), proposal);
export const getInvoiceFiles = compose(get("file"), invoice);
export const getMarkdownFile = compose(find(isMarkdown), getProposalFiles);
export const getNotMarkdownFile = compose(
  filter(not(isMarkdown)),
  getProposalFiles
);

export const resolveEditUserValues = (prefs) => {
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

export const getUserPaywallStatus = (state) => {
  if (isCMS(state)) return CMS_PAYWALL_STATUS;
  if (userAlreadyPaid(state)) {
    return PAYWALL_STATUS_PAID;
  }

  return state.app.userPaywallStatus || PAYWALL_STATUS_WAITING;
};
export const getUserPaywallConfirmations = (state) => {
  if (userAlreadyPaid(state)) {
    return null;
  }
  return state.app.userPaywallConfirmations;
};

export const getUserPaywallTxid = (state) => {
  if (userAlreadyPaid(state)) {
    return null;
  }
  return state.app.userPaywallTxid;
};

export const userHasPaid = (state) => {
  return getUserPaywallStatus(state) === PAYWALL_STATUS_PAID;
};
export const userCanExecuteActions = (state) => {
  return userHasPaid(state) && !getKeyMismatch(state);
};

export const dccComments = (state) => apiDCCComments(state);

export const getTempThreadTree = (state) => state.app.replyThreadTree;

export const unvettedProposals = (state) => {
  const unvettedProposals = apiUnvettedProposals(state);
  return unvettedProposals;
};

export const vettedProposals = (state) => {
  const vettedProposals = apiVettedProposals(state);
  return vettedProposals;
};

export const getDraftProposals = (state) => {
  const draftsObj = draftProposals(state) || {};
  const drafts = Object.keys(draftsObj)
    .filter(
      (key) => ["newDraft", "lastSubmitted", "originalName"].indexOf(key) === -1
    )
    .map((key) => draftsObj[key]);
  return drafts;
};

export const getSubmittedUserInvoices = (state) => {
  const invoices = apiUserInvoices(state);

  const sortByNewestFirst = orderBy(["timestamp"], ["desc"]);

  return sortByNewestFirst(invoices);
};

export const getSubmittedUserProposals = (state) => (userID) => {
  const isUserProp = (prop) => prop.userid === userID;
  const vettedProps = vettedProposals(state).filter(isUserProp);
  const unvettedProps = unvettedProposals(state).filter(isUserProp);

  const sortByNewestFirst = orderBy(["timestamp"], ["desc"]);

  return sortByNewestFirst(vettedProps.concat(unvettedProps));
};

export const getUserProposalsWithVoteStatus = (state, { userID }) => {
  const userProposals = getSubmittedUserProposals(state)(userID);
  return userProposals.map((prop) => ({
    ...prop,
    voteStatus: getPropVoteStatus(state)(prop.censorshiprecord.token)
  }));
};

// TODO: call getUserInvoicesCountByStatus
export const getUserInvoicesFilterCounts = (state) => {
  let invoices = apiUserInvoices(state);
  const { month, year } = state.app.invoiceSortOption;
  if (month !== FILTER_ALL_MONTHS) {
    invoices = getInvoicesByMonth(getInvoicesByYear(invoices, year), month);
  }
  const draftFilterCounts = {
    [PROPOSAL_USER_FILTER_DRAFT_INVOICES]: getDraftInvoices(state).length
  };
  const userInvoiceCounts = Object.assign(
    {},
    getInvoicesCountByStatus(invoices),
    draftFilterCounts
  );
  return userInvoiceCounts;
};

export const getAdminInvoicesCountByStatus = (state) => {
  let invoices = apiAdminInvoices(state);
  const { month, year } = state.app.invoiceSortOption;
  if (month !== FILTER_ALL_MONTHS) {
    invoices = getInvoicesByMonth(getInvoicesByYear(invoices, year), month);
  }
  return getInvoicesCountByStatus(invoices);
};

export const getInvoicesCountByStatus = (invoices) => {
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
    : invoices.filter((i) => i.status === status);

const getInvoicesByYear = (invoices, year) =>
  year === getCurrentYear()
    ? invoices
    : invoices.filter((i) => i.input.year === year);

const getInvoicesByMonth = (invoices = [], month) =>
  month === FILTER_ALL_MONTHS
    ? invoices
    : invoices.filter((i) => i.input.month === month);

export const getAdminInvoices = (state) => {
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

export const getUserInvoices = (state) => {
  const invoices = apiUserInvoices(state);
  const userFilterValue = getUserFilterValue(state);
  const monthFilter = getMonthFilterValue(state);
  const yearFilter = getYearFilterValue(state);

  if (!invoices) return [];

  const invoicesByStatus = getInvoicesByStatus(invoices, userFilterValue);
  const invoicesByYear = getInvoicesByYear(invoicesByStatus, yearFilter);
  const invoicesByMonth = getInvoicesByMonth(invoicesByYear, monthFilter);

  if (userFilterValue === PROPOSAL_USER_FILTER_DRAFT_INVOICES) {
    return getDraftInvoices(state);
  } else {
    return invoicesByStatus && invoicesByYear && invoicesByMonth;
  }
};

export const getDraftInvoices = (state) => {
  const draftsObj = draftInvoices(state) || {};
  const drafts = Object.keys(draftsObj)
    .filter(
      (key) => ["newDraft", "lastSubmitted", "originalName"].indexOf(key) === -1
    )
    .map((key) => draftsObj[key]);

  const sortByNewestFirst = orderBy(["timestamp"], ["desc"]);

  return sortByNewestFirst(drafts);
};

export const getCsrfIsNeeded = (state) =>
  state.app ? state.app.csrfIsNeeded : null;

export const shouldAutoVerifyKey = (state) => state.app.shouldVerifyKey;

export const identityImportError = (state) =>
  state.app.identityImportResult && state.app.identityImportResult.errorMsg;

export const identityImportSuccess = (state) =>
  state.app.identityImportResult && state.app.identityImportResult.successMsg;

export const pollingCreditsPayment = (state) => state.app.pollingCreditsPayment;

export const reachedCreditsPaymentPollingLimit = (state) =>
  state.app.reachedCreditsPaymentPollingLimit;

export const proposalPaymentReceived = (state) =>
  state.app.proposalPaymentReceived;
