import * as act from "../actions/types";
import { DEFAULT_REQUEST_STATE, receive, request, reset } from "./util";
import { onRequestLikeComment } from "./handlers";

export const DEFAULT_STATE = {
  me: DEFAULT_REQUEST_STATE,
  init: DEFAULT_REQUEST_STATE,
  policy: DEFAULT_REQUEST_STATE,
  newUser: DEFAULT_REQUEST_STATE,
  verifyNewUser: DEFAULT_REQUEST_STATE,
  user: DEFAULT_REQUEST_STATE,
  login: DEFAULT_REQUEST_STATE,
  logout: DEFAULT_REQUEST_STATE,
  changeUsername: DEFAULT_REQUEST_STATE,
  changePassword: DEFAULT_REQUEST_STATE,
  userProposals: DEFAULT_REQUEST_STATE,
  userInventory: DEFAULT_REQUEST_STATE,
  tokenInventory: DEFAULT_REQUEST_STATE,
  proposalsBatch: DEFAULT_REQUEST_STATE,
  proposal: DEFAULT_REQUEST_STATE,
  proposalComments: DEFAULT_REQUEST_STATE,
  likeComment: DEFAULT_REQUEST_STATE,
  censorComment: DEFAULT_REQUEST_STATE,
  commentslikes: DEFAULT_REQUEST_STATE,
  editUser: DEFAULT_REQUEST_STATE,
  codestats: DEFAULT_REQUEST_STATE,
  manageUser: DEFAULT_REQUEST_STATE,
  userSearch: DEFAULT_REQUEST_STATE,
  newProposal: DEFAULT_REQUEST_STATE,
  editProposal: DEFAULT_REQUEST_STATE,
  newComment: DEFAULT_REQUEST_STATE,
  proposalPaywallDetails: DEFAULT_REQUEST_STATE,
  proposalOwnerBilling: DEFAULT_REQUEST_STATE,
  userProposalCredits: DEFAULT_REQUEST_STATE,
  resetPassword: DEFAULT_REQUEST_STATE,
  verifyResetPassword: DEFAULT_REQUEST_STATE,
  resendVerificationEmail: DEFAULT_REQUEST_STATE,
  setStatusProposal: DEFAULT_REQUEST_STATE,
  startVote: DEFAULT_REQUEST_STATE,
  updateUserKey: DEFAULT_REQUEST_STATE,
  verifyUserKey: DEFAULT_REQUEST_STATE,
  proposalsVoteSummary: DEFAULT_REQUEST_STATE,
  proposalVoteResults: DEFAULT_REQUEST_STATE,
  authorizeVote: DEFAULT_REQUEST_STATE,
  proposalPaywallPayment: DEFAULT_REQUEST_STATE,
  rescanUserPayments: DEFAULT_REQUEST_STATE,
  payouts: DEFAULT_REQUEST_STATE,
  invoicePayouts: DEFAULT_REQUEST_STATE,
  payApproved: DEFAULT_REQUEST_STATE,
  spendingSummary: DEFAULT_REQUEST_STATE,
  inviteUser: DEFAULT_REQUEST_STATE,
  newInvoice: DEFAULT_REQUEST_STATE,
  userInvoices: DEFAULT_REQUEST_STATE,
  adminInvoices: DEFAULT_REQUEST_STATE,
  invoice: DEFAULT_REQUEST_STATE,
  invoiceComments: DEFAULT_REQUEST_STATE,
  setStatusInvoice: DEFAULT_REQUEST_STATE,
  editInvoice: DEFAULT_REQUEST_STATE,
  exchangeRate: DEFAULT_REQUEST_STATE,
  manageCmsUser: DEFAULT_REQUEST_STATE,
  userSubcontractors: DEFAULT_REQUEST_STATE,
  newDcc: DEFAULT_REQUEST_STATE,
  dccs: DEFAULT_REQUEST_STATE,
  dcc: DEFAULT_REQUEST_STATE,
  supportOpposeDCC: DEFAULT_REQUEST_STATE,
  setDCCStatus: DEFAULT_REQUEST_STATE,
  setTotp: DEFAULT_REQUEST_STATE,
  verifyTotp: DEFAULT_REQUEST_STATE
};

const api = (state = DEFAULT_STATE, action) =>
  ((
    {
      [act.REQUEST_ME]: () => request("me", state, action),
      [act.RECEIVE_ME]: () => receive("me", state, action),
      [act.REQUEST_INIT_SESSION]: () => request("init", state, action),
      [act.RECEIVE_INIT_SESSION]: () => receive("init", state, action),
      [act.REQUEST_POLICY]: () => request("policy", state, action),
      [act.RECEIVE_POLICY]: () => receive("policy", state, action),
      [act.REQUEST_NEW_USER]: () => request("newUser", state, action),
      [act.RECEIVE_NEW_USER]: () => receive("newUser", state, action),
      [act.RESET_NEW_USER]: () => reset("newUser", state),
      [act.REQUEST_VERIFY_NEW_USER]: () =>
        request("verifyNewUser", state, action),
      [act.RECEIVE_VERIFY_NEW_USER]: () =>
        receive("verifyNewUser", state, action),
      [act.REQUEST_USER]: () => request("user", state, action),
      [act.RECEIVE_USER]: () => receive("user", state, action),
      [act.REQUEST_LOGIN]: () => request("login", state, action),
      [act.RECEIVE_LOGIN]: () => receive("login", state, action),
      [act.REQUEST_LOGOUT]: () => request("logout", state, action),
      [act.RECEIVE_LOGOUT]: () => receive("logout", state, action),
      [act.REQUEST_CHANGE_USERNAME]: () =>
        request("changeUsername", state, action),
      [act.RECEIVE_CHANGE_USERNAME]: () =>
        receive("changeUsername", state, action),
      [act.REQUEST_CHANGE_PASSWORD]: () =>
        request("changePassword", state, action),
      [act.RECEIVE_CHANGE_PASSWORD]: () =>
        receive("changePassword", state, action),
      [act.REQUEST_USER_INVENTORY]: () =>
        request("userInventory", state, action),
      [act.RECEIVE_USER_INVENTORY]: () => receive("userInventory", state),
      [act.REQUEST_TOKEN_INVENTORY]: () =>
        request("tokenInventory", state, action),
      [act.RECEIVE_VOTES_INVENTORY]: () =>
        receive("tokenInventory", state, action),
      [act.REQUEST_PROPOSALS_BATCH]: () =>
        request("proposalsBatch", state, action),
      [act.RECEIVE_PROPOSALS_BATCH]: () => receive("proposalsBatch", state),
      [act.REQUEST_PROPOSAL]: () => request("proposal", state, action),
      [act.RECEIVE_PROPOSAL]: () => receive("proposal", state, action),
      [act.REQUEST_CODE_STATS]: () => request("codestats", state, action),
      [act.RECEIVE_CODE_STATS]: () => receive("codestats", state, action),
      [act.REQUEST_PROPOSAL_BILLING]: () =>
        request("proposalOwnerBilling", state, action),
      [act.RECEIVE_PROPOSAL_BILLING]: () =>
        receive("proposalOwnerBilling", state, action),
      [act.REQUEST_RECORD_COMMENTS]: () =>
        request("proposalComments", state, action),
      [act.RECEIVE_RECORD_COMMENTS]: () =>
        receive("proposalComments", state, action),
      [act.REQUEST_LIKE_COMMENT]: () => onRequestLikeComment(state, action),
      [act.RECEIVE_LIKE_COMMENT]: () => receive("likeComment", state, action),
      [act.REQUEST_CENSOR_COMMENT]: () =>
        request("censorComment", state, action),
      [act.RECEIVE_CENSOR_COMMENT]: () => receive("censorComment", state),
      [act.REQUEST_LIKED_COMMENTS]: () =>
        request("commentslikes", state, action),
      [act.RECEIVE_LIKED_COMMENTS]: () =>
        receive("commentslikes", state, action),
      [act.REQUEST_EDIT_USER]: () => request("editUser", state, action),
      [act.RECEIVE_EDIT_USER]: () => receive("editUser", state, action),
      [act.REQUEST_MANAGE_USER]: () => request("manageUser", state, action),
      [act.RECEIVE_MANAGE_USER]: () => receive("manageUser", state),
      [act.REQUEST_USER_SEARCH]: () => request("userSearch", state, action),
      [act.RECEIVE_USER_SEARCH]: () => receive("userSearch", state, action),
      [act.REQUEST_NEW_PROPOSAL]: () => request("newProposal", state, action),
      [act.RECEIVE_NEW_PROPOSAL]: () => receive("newProposal", state, action),
      [act.REQUEST_EDIT_PROPOSAL]: () => request("editProposal", state, action),
      [act.RECEIVE_EDIT_PROPOSAL]: () => receive("editProposal", state, action),
      [act.REQUEST_NEW_COMMENT]: () => request("newComment", state, action),
      [act.RECEIVE_NEW_COMMENT]: () => receive("newComment", state),
      [act.REQUEST_PROPOSAL_PAYWALL_DETAILS]: () =>
        request("proposalPaywallDetails", state, action),
      [act.RECEIVE_PROPOSAL_PAYWALL_DETAILS]: () =>
        receive("proposalPaywallDetails", state, action),
      [act.REQUEST_USER_PROPOSAL_CREDITS]: () =>
        request("userProposalCredits", state, action),
      [act.RECEIVE_USER_PROPOSAL_CREDITS]: () =>
        receive("userProposalCredits", state, action),
      [act.REQUEST_RESET_PASSWORD]: () =>
        request("resetPassword", state, action),
      [act.RECEIVE_RESET_PASSWORD]: () =>
        receive("resetPassword", state, action),
      [act.REQUEST_VERIFY_RESET_PASSWORD]: () =>
        request("verifyResetPassword", state, action),
      [act.RECEIVE_VERIFY_RESET_PASSWORD]: () =>
        receive("verifyResetPassword", state, action),
      [act.REQUEST_RESEND_VERIFICATION_EMAIL]: () =>
        request("resendVerificationEmail", state, action),
      [act.RECEIVE_RESEND_VERIFICATION_EMAIL]: () =>
        receive("resendVerificationEmail", state, action),
      [act.RESET_RESEND_VERIFICATION_EMAIL]: () =>
        reset("resendVerificationEmail", state),
      [act.REQUEST_SETSTATUS_PROPOSAL]: () =>
        request("setStatusProposal", state, action),
      [act.RECEIVE_SETSTATUS_PROPOSAL]: () =>
        receive("setStatusProposal", state),
      [act.REQUEST_START_VOTE]: () => request("startVote", state, action),
      [act.RECEIVE_START_VOTE]: () => receive("startVote", state),
      [act.RECEIVE_START_RUNOFF_VOTE]: () => receive("startRunoffVote", state),
      [act.REQUEST_START_RUNOFF_VOTE]: () =>
        request("startRunoffVote", state, action),
      [act.REQUEST_UPDATED_KEY]: () => request("updateUserKey", state, action),
      [act.RECEIVE_UPDATED_KEY]: () => receive("updateUserKey", state, action),
      [act.REQUEST_VERIFIED_KEY]: () => request("verifyUserKey", state, action),
      [act.RECEIVE_VERIFIED_KEY]: () => receive("verifyUserKey", state, action),
      [act.REQUEST_PROPOSALS_VOTE_SUMMARY]: () =>
        request("proposalsVoteSummary", state, action),
      [act.RECEIVE_PROPOSALS_VOTE_SUMMARY]: () =>
        receive("proposalsVoteSummary", state, {}),
      [act.REQUEST_PROPOSAL_VOTE_RESULTS]: () =>
        request("proposalVoteResults", state, action),
      [act.RECEIVE_PROPOSAL_VOTE_RESULTS]: () =>
        receive("proposalVoteResults", state, action),
      [act.REQUEST_VOTES_DETAILS]: () => request("votesDetails", state, action),
      [act.RECEIVE_VOTES_DETAILS]: () => receive("votesDetails", state, action),
      [act.REQUEST_AUTHORIZE_VOTE]: () =>
        request("authorizeVote", state, action),
      [act.RECEIVE_AUTHORIZE_VOTE]: () => receive("authorizeVote", state, {}),
      [act.REQUEST_REVOKE_AUTH_VOTE]: () =>
        request("authorizeVote", state, action),
      [act.RECEIVE_REVOKE_AUTH_VOTE]: () => receive("authorizeVote", state, {}),
      [act.REQUEST_PROPOSAL_PAYWALL_PAYMENT]: () =>
        request("proposalPaywallPayment", state, action),
      [act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT]: () =>
        receive("proposalPaywallPayment", state, action),
      [act.REQUEST_RESCAN_USER_PAYMENTS]: () =>
        request("rescanUserPayments", state, action),
      [act.RECEIVE_RESCAN_USER_PAYMENTS]: () =>
        receive("rescanUserPayments", state, {}),
      [act.RESET_RESCAN_USER_PAYMENTS]: () =>
        reset("rescanUserPayments", state, action),
      [act.RESET_RESCAN_USER_PAYMENTS]: () =>
        reset("rescanUserPayments", state, action),
      [act.REQUEST_SET_TOTP]: () => request("setTotp", state, action),
      [act.RECEIVE_SET_TOTP]: () => receive("setTotp", state, action),
      [act.REQUEST_VERIFY_TOTP]: () => request("verifyTotp", state, action),
      [act.RECEIVE_VERIFY_TOTP]: () => receive("verifyTotp", state, action),
      [act.REQUEST_VOTES_BUNDLE]: () => request("votesBundle", state, action),
      [act.RECEIVE_VOTES_BUNDLE]: () => receive("votesBundle", state, action),
      // == CMS START ==
      [act.REQUEST_GENERATE_PAYOUTS]: () => request("payouts", state, action),
      [act.RECEIVE_GENERATE_PAYOUTS]: () => receive("payouts", state, action),
      [act.REQUEST_INVOICE_PAYOUTS]: () =>
        request("invoicePayouts", state, action),
      [act.RECEIVE_INVOICE_PAYOUTS]: () =>
        receive("invoicePayouts", state, action),
      [act.REQUEST_PAY_APPROVED]: () => request("payApproved", state, action),
      [act.RECEIVE_PAY_APPROVED]: () => receive("payApproved", state, action),
      [act.REQUEST_SPENDING_SUMMARY]: () =>
        request("spendingSummary", state, action),
      [act.RECEIVE_SPENDING_SUMMARY]: () =>
        receive("spendingSummary", state, action),
      [act.REQUEST_SPENDING_DETAILS]: () =>
        request("spendingDetails", state, action),
      [act.RECEIVE_SPENDING_DETAILS]: () =>
        receive("spendingDetails", state, action),
      [act.REQUEST_INVITE_USER]: () => request("inviteUser", state, action),
      [act.RECEIVE_INVITE_USER]: () => receive("inviteUser", state, action),
      [act.REQUEST_NEW_INVOICE]: () => request("newInvoice", state, action),
      [act.RECEIVE_NEW_INVOICE]: () => receive("newInvoice", state, action),
      [act.REQUEST_USER_INVOICES]: () => request("userInvoices", state, action),
      [act.RECEIVE_USER_INVOICES]: () => receive("userInvoices", state, action),
      [act.REQUEST_ADMIN_INVOICES]: () =>
        request("adminInvoices", state, action),
      [act.RECEIVE_ADMIN_INVOICES]: () =>
        receive("adminInvoices", state, action),
      [act.REQUEST_INVOICE]: () => request("invoice", state, action),
      [act.RECEIVE_INVOICE]: () => receive("invoice", state, action),
      [act.REQUEST_RECORD_COMMENTS]: () =>
        request("invoiceComments", state, action),
      [act.RECEIVE_RECORD_COMMENTS]: () =>
        receive("invoiceComments", state, action),
      [act.REQUEST_SETSTATUS_INVOICE]: () =>
        request("setStatusInvoice", state, action),
      [act.RECEIVE_SETSTATUS_INVOICE]: () =>
        receive("setStatusInvoice", state, action),
      [act.REQUEST_EDIT_INVOICE]: () => request("editInvoice", state, action),
      [act.RECEIVE_EDIT_INVOICE]: () => receive("editInvoice", state, action),
      [act.REQUEST_EXCHANGE_RATE]: () => request("exchangeRate", state, action),
      [act.RECEIVE_EXCHANGE_RATE]: () => receive("exchangeRate", state, action),
      [act.REQUEST_MANAGE_CMS_USER]: () =>
        request("manageCmsUser", state, action),
      [act.RECEIVE_MANAGE_CMS_USER]: () =>
        receive("manageCmsUser", state, action),
      [act.REQUEST_USER_SUBCONTRACTORS]: () =>
        request("userSubcontractors", state, action),
      [act.RECEIVE_USER_SUBCONTRACTORS]: () =>
        receive("userSubcontractors", state, action),
      [act.REQUEST_NEW_DCC]: () => request("newDcc", state, action),
      [act.RECEIVE_NEW_DCC]: () => receive("newDcc", state, action),
      [act.REQUEST_DCCS]: () => request("dccs", state, action),
      [act.RECEIVE_DCCS]: () => receive("dccs", state, action),
      [act.REQUEST_DCC]: () => request("dcc", state, action),
      [act.RECEIVE_DCC]: () => receive("dcc", state, action),
      [act.REQUEST_SUPPORT_OPPOSE_DCC]: () =>
        request("supportOpposeDCC", state, action),
      [act.RECEIVE_SUPPORT_OPPOSE_DCC]: () =>
        receive("supportOpposeDCC", state, action),
      [act.REQUEST_SET_DCC_STATUS]: () =>
        request("setDCCStatus", state, action),
      [act.RECEIVE_SET_DCC_STATUS]: () => receive("setDccStatus", state, action)
      // === CMS END ===
    }[action.type] || (() => state)
  )());

export default api;
