import * as act from "../../actions/types";
import * as api from "../api";
import { DEFAULT_REQUEST_STATE } from "../util";

describe("test api reducer", () => {
  test("default tests for api reducer", () => {
    expect(api.DEFAULT_STATE).toEqual({
      me: DEFAULT_REQUEST_STATE,
      init: DEFAULT_REQUEST_STATE,
      policy: DEFAULT_REQUEST_STATE,
      newUser: DEFAULT_REQUEST_STATE,
      verifyNewUser: DEFAULT_REQUEST_STATE,
      user: DEFAULT_REQUEST_STATE,
      login: DEFAULT_REQUEST_STATE,
      logout: DEFAULT_REQUEST_STATE,
      userInventory: DEFAULT_REQUEST_STATE,
      changeUsername: DEFAULT_REQUEST_STATE,
      changePassword: DEFAULT_REQUEST_STATE,
      userProposals: DEFAULT_REQUEST_STATE,
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
      spendingSummary: DEFAULT_REQUEST_STATE,
      editProposal: DEFAULT_REQUEST_STATE,
      newComment: DEFAULT_REQUEST_STATE,
      proposalPaywallDetails: DEFAULT_REQUEST_STATE,
      userProposalCredits: DEFAULT_REQUEST_STATE,
      resetPassword: DEFAULT_REQUEST_STATE,
      verifyResetPassword: DEFAULT_REQUEST_STATE,
      resendVerificationEmail: DEFAULT_REQUEST_STATE,
      setStatusProposal: DEFAULT_REQUEST_STATE,
      proposalOwnerBilling: DEFAULT_REQUEST_STATE,
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
    });

    expect(api.default(undefined, { type: "" })).toEqual(api.DEFAULT_STATE);

    // logout action
    const action = {
      type: act.RECEIVE_LOGOUT
    };

    expect(api.default(undefined, action)).toEqual(api.DEFAULT_STATE);
  });
});
