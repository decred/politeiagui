import * as act from "../../actions/types";
import * as api from "../api";
import { DEFAULT_REQUEST_STATE } from "../util";

describe("test api reducer", () => {
  test("default tests for api reducer", () => {
    expect(api.DEFAULT_STATE).toEqual({
      me: DEFAULT_REQUEST_STATE,
      unvettedStatus: DEFAULT_REQUEST_STATE,
      init: DEFAULT_REQUEST_STATE,
      policy: DEFAULT_REQUEST_STATE,
      newUser: DEFAULT_REQUEST_STATE,
      verifyNewUser: DEFAULT_REQUEST_STATE,
      login: DEFAULT_REQUEST_STATE,
      logout: DEFAULT_REQUEST_STATE,
      censorComment: DEFAULT_REQUEST_STATE,
      vetted: DEFAULT_REQUEST_STATE,
      unvetted: DEFAULT_REQUEST_STATE,
      proposal: DEFAULT_REQUEST_STATE,
      invoice: DEFAULT_REQUEST_STATE,
      adminInvoices: DEFAULT_REQUEST_STATE,
      userInvoices: DEFAULT_REQUEST_STATE,
      proposalComments: DEFAULT_REQUEST_STATE,
      invoiceComments: DEFAULT_REQUEST_STATE,
      proposalsVoteStatus: DEFAULT_REQUEST_STATE,
      proposalVoteStatus: DEFAULT_REQUEST_STATE,
      commentslikes: DEFAULT_REQUEST_STATE,
      userProposals: DEFAULT_REQUEST_STATE,
      newProposal: DEFAULT_REQUEST_STATE,
      editProposal: DEFAULT_REQUEST_STATE,
      newInvoice: DEFAULT_REQUEST_STATE,
      editInvoice: DEFAULT_REQUEST_STATE,
      newComment: DEFAULT_REQUEST_STATE,
      userProposalCredits: DEFAULT_REQUEST_STATE,
      forgottenPassword: DEFAULT_REQUEST_STATE,
      passwordReset: DEFAULT_REQUEST_STATE,
      changeUsername: DEFAULT_REQUEST_STATE,
      changePassword: DEFAULT_REQUEST_STATE,
      updateUserKey: DEFAULT_REQUEST_STATE,
      verifyUserKey: DEFAULT_REQUEST_STATE,
      likeComment: DEFAULT_REQUEST_STATE,
      userSearch: DEFAULT_REQUEST_STATE,
      payouts: DEFAULT_REQUEST_STATE,
      tokenInventory: DEFAULT_REQUEST_STATE,
      proposalPaywallPayment: DEFAULT_REQUEST_STATE,
      rescanUserPayments: DEFAULT_REQUEST_STATE,
      user: DEFAULT_REQUEST_STATE,
      proposalPaywallDetails: DEFAULT_REQUEST_STATE,
      email: "",
      keyMismatch: false,
      lastLoaded: {},
      newDcc: DEFAULT_REQUEST_STATE,
      dccs: DEFAULT_REQUEST_STATE
    });

    expect(api.default(undefined, { type: "" })).toEqual(api.DEFAULT_STATE);

    // logout action
    let action = {
      type: act.RECEIVE_LOGOUT
    };

    expect(api.default(undefined, action)).toEqual(api.DEFAULT_STATE);

    // key mismatch action
    action = {
      type: act.KEY_MISMATCH,
      payload: "warning msg"
    };

    expect(api.default({}, action)).toEqual({ keyMismatch: action.payload });

    // set email action
    action = {
      type: act.SET_EMAIL,
      payload: "any@any.com"
    };

    expect(api.default({}, action)).toEqual({ email: action.payload });
  });
});
