import * as sel from "../api";
import { MOCK_STATE } from "./mock_state";

describe("test api selectors", () => {
  const FAKE_PAYWALL = {
    address: "T_fake_address",
    amount: 1000000000,
    txNotBefore: "any"
  };

  const FAKE_PUBKEY = "fake_pub_key";
  const FAKE_CSRF = "fake_csrf_token";

  test("testing higher order selectors", () => {
    // isRequesting
    expect(sel.getIsApiRequesting("init")({})).toEqual(false);
    expect(sel.getIsApiRequesting("init")(MOCK_STATE)).toEqual(true);

    // payload
    expect(sel.getApiPayload("newUser")({})).toEqual(undefined);
    expect(sel.getApiPayload("newUser")(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newUser.payload
    );

    // response
    expect(sel.getApiResponse("newUser")({})).toEqual(undefined);
    expect(sel.getApiResponse("newUser")(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newUser.response
    );

    // error
    expect(sel.getApiError("newUser")({})).toEqual(undefined);
    expect(sel.getApiError("newUser")(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newUser.error
    );
  });

  test("testing conditional selectors", () => {
    let state;
    // proposalCreditPrice
    expect(sel.proposalCreditPrice(MOCK_STATE)).toEqual(2);
    expect(
      sel.proposalCreditPrice({ api: { proposalPaywallDetails: {} } })
    ).toEqual(0);

    // userAlreadyPaid
    expect(sel.userAlreadyPaid(MOCK_STATE)).toEqual(false);

    state = {
      api: { ...MOCK_STATE.api, me: { response: { paywalladdress: "" } } }
    };

    expect(sel.userAlreadyPaid(state)).toEqual(true);

    // paywallAmount
    expect(sel.paywallAmount(MOCK_STATE)).toEqual(10);

    state = { api: { ...MOCK_STATE.api, newUser: {} } };

    expect(sel.paywallAmount(state)).toEqual(10);

    state = { api: { ...MOCK_STATE.api, newUser: {}, me: {} } };

    expect(sel.paywallAmount(state)).toEqual(0);

    // paywallTxNotBefore
    expect(sel.paywallTxNotBefore(MOCK_STATE)).toEqual(
      FAKE_PAYWALL.txNotBefore
    );

    state = { api: { ...MOCK_STATE.api, newUser: {} } };

    expect(sel.paywallTxNotBefore(state)).toEqual(FAKE_PAYWALL.txNotBefore);

    state = { api: { ...MOCK_STATE.api, newUser: {}, me: {} } };

    expect(sel.paywallTxNotBefore(state)).toEqual(null);
  });

  test("testing composed selectors", () => {
    expect(sel.proposalPaywallAddress(MOCK_STATE)).toEqual(
      FAKE_PAYWALL.address
    );

    expect(sel.proposalPaywallTxNotBefore(MOCK_STATE)).toEqual(
      FAKE_PAYWALL.txNotBefore
    );

    expect(sel.csrf(MOCK_STATE)).toEqual(FAKE_CSRF);

    expect(sel.isTestNet(MOCK_STATE)).toEqual(true);

    expect(sel.serverPubkey(MOCK_STATE)).toEqual(FAKE_PUBKEY);

    expect(sel.userPubkey(MOCK_STATE)).toEqual(FAKE_PUBKEY);

    expect(sel.apiProposal(MOCK_STATE)).toEqual(
      MOCK_STATE.api.proposal.response.proposal
    );

    expect(sel.user(MOCK_STATE)).toEqual(MOCK_STATE.api.user.response.user);

    expect(sel.newProposalToken(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newProposal.response.censorshiprecord.token
    );

    expect(sel.newProposalSignature(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newProposal.response.censorshiprecord.signature
    );

    expect(sel.newProposalName(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newProposal.payload.name
    );

    expect(sel.newProposalDescription(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newProposal.payload.description
    );

    expect(sel.newProposalFiles(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newProposal.payload.files
    );

    expect(sel.setStatusProposal(MOCK_STATE)).toEqual(
      MOCK_STATE.api.setStatusProposal.response.status
    );

    expect(sel.setStatusProposalToken(MOCK_STATE)).toEqual(
      MOCK_STATE.api.setStatusProposal.payload.token
    );

    expect(sel.verificationToken(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newUser.response.verificationtoken
    );

    expect(sel.manageUserAction(MOCK_STATE)).toEqual(
      MOCK_STATE.api.manageUser.payload.action
    );
  });

  test("testing or selectors", () => {
    let state;

    state = {
      api: {
        ...MOCK_STATE.api,
        proposal: { isRequesting: false },
        startVote: { isRequesting: false },
        init: { isRequesting: false }
      }
    };

    // isAdmin
    expect(sel.isAdmin(MOCK_STATE)).toEqual(true);

    state = {
      api: { ...MOCK_STATE.api, me: { response: { isadmin: false } } }
    };

    expect(sel.isAdmin(state)).toEqual(true);

    state = {
      api: {
        ...MOCK_STATE.api,
        me: { response: { isadmin: false } },
        login: { response: { isadmin: false } }
      }
    };

    expect(sel.isAdmin(state)).toEqual(false);

    // paywallAddress
    expect(sel.paywallAddress(MOCK_STATE)).toEqual(FAKE_PAYWALL.address);

    state = {
      api: {
        ...MOCK_STATE.api,
        newUser: { response: { paywalladdress: null } }
      }
    };

    expect(sel.paywallAddress(state)).toEqual(FAKE_PAYWALL.address);

    state = {
      api: {
        ...MOCK_STATE.api,
        newUser: { response: { paywalladdress: null } },
        me: { response: { paywalladdress: null } }
      }
    };

    expect(sel.paywallAddress(state)).toEqual(null);
  });
});
