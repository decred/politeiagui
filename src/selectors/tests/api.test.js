import * as sel from "../api";
import { MOCK_STATE } from "./mock_state";

describe("test api selectors", () => {
  const FAKE_USER = {
    email: "test@emai"
  };

  const FAKE_PAYWALL = {
    address: "T_fake_address",
    amount: 1000000000,
    txNotBefore: "any"
  };

  const FAKE_PUBKEY = "fake_pub_key";
  const FAKE_CSRF = "fake_csrf_token";
  const FAKE_TOKEN = "fake_token";

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

    // proposalCreditPurchases
    expect(sel.proposalCreditPurchases({})).toEqual([]);
    expect(sel.proposalCreditPurchases(MOCK_STATE)).toEqual([
      {
        price:
          MOCK_STATE.api.userProposalCredits.response.spentcredits[0].price /
          100000000,
        datePurchased:
          MOCK_STATE.api.userProposalCredits.response.spentcredits[0]
            .datepurchased,
        numberPurchased: 1,
        txId: MOCK_STATE.api.userProposalCredits.response.spentcredits[0].txid
      },
      {
        price:
          MOCK_STATE.api.userProposalCredits.response.unspentcredits[0].price /
          100000000,
        datePurchased:
          MOCK_STATE.api.userProposalCredits.response.unspentcredits[0]
            .datepurchased,
        numberPurchased: 1,
        txId: MOCK_STATE.api.userProposalCredits.response.unspentcredits[0].txid
      }
    ]);

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

    state = { api: { ...MOCK_STATE.api, startVote: {} } };

    // getPropVoteStatus
    expect(
      sel.getPropVoteStatus(MOCK_STATE)(
        "6284c5f8fba5665373b8e6651ebc8747b289fed242d2f880f64a284496bb4ca8"
      )
    ).toEqual(MOCK_STATE.api.proposalVoteStatus.response);

    state = { api: { ...MOCK_STATE.api, proposalVoteStatus: {} } };

    expect(sel.getPropVoteStatus(MOCK_STATE)("fake_token")).toEqual(
      MOCK_STATE.api.proposalsVoteStatus.response.votesstatus[0]
    );

    expect(sel.getPropVoteStatus(MOCK_STATE)("fake_token2")).toEqual(
      MOCK_STATE.api.proposalsVoteStatus.response.votesstatus[1]
    );

    expect(sel.getPropVoteStatus(MOCK_STATE)("fake_token5234")).toEqual({});

    state = {
      api: {
        ...MOCK_STATE.api,
        proposalVoteStatus: {},
        proposalsVoteStatus: {}
      }
    };

    expect(sel.getPropVoteStatus(state)("fake_token2")).toEqual({});
  });

  test("testing composed selectors", () => {
    expect(sel.proposalPaywallAddress(MOCK_STATE)).toEqual(
      FAKE_PAYWALL.address
    );

    expect(sel.proposalPaywallTxNotBefore(MOCK_STATE)).toEqual(
      FAKE_PAYWALL.txNotBefore
    );

    expect(sel.csrf(MOCK_STATE)).toEqual(FAKE_CSRF);

    expect(sel.newUserEmail(MOCK_STATE)).toEqual(FAKE_USER.email);

    expect(sel.forgottenPassEmail(MOCK_STATE)).toEqual(FAKE_USER.email);

    expect(sel.emailForResendVerification(MOCK_STATE)).toEqual(FAKE_USER.email);

    expect(sel.isTestNet(MOCK_STATE)).toEqual(true);

    expect(sel.serverPubkey(MOCK_STATE)).toEqual(FAKE_PUBKEY);

    expect(sel.userPubkey(MOCK_STATE)).toEqual(FAKE_PUBKEY);

    expect(sel.apiProposal(MOCK_STATE)).toEqual(
      MOCK_STATE.api.proposal.response.proposal
    );

    expect(sel.proposalToken(MOCK_STATE)).toEqual(FAKE_TOKEN);

    expect(sel.user(MOCK_STATE)).toEqual(MOCK_STATE.api.user.response.user);

    expect(sel.newProposalMerkle(MOCK_STATE)).toEqual(
      MOCK_STATE.api.newProposal.response.censorshiprecord.merkle
    );

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

    expect(sel.lastLoginTimeFromLoginResponse(MOCK_STATE)).toEqual(
      MOCK_STATE.api.login.response.lastlogintime
    );

    expect(sel.editProposalToken(MOCK_STATE)).toEqual(
      MOCK_STATE.api.editProposal.response.proposal.censorshiprecord.token
    );
  });

  test("testing or selectors", () => {
    let state;
    // isApiRequesting
    expect(sel.isApiRequesting(MOCK_STATE)).toEqual(true);

    state = { api: { ...MOCK_STATE.api, init: { isRequesting: false } } };

    expect(sel.isApiRequesting(state)).toEqual(true);

    state = {
      api: {
        ...MOCK_STATE.api,
        proposal: { isRequesting: false },
        startVote: { isRequesting: false },
        init: { isRequesting: false }
      }
    };

    expect(sel.isApiRequesting(state)).toEqual(false);

    // apiError
    expect(sel.apiError(MOCK_STATE)).toEqual(true);

    state = { api: { ...MOCK_STATE.api, init: { error: false } } };

    expect(sel.apiError(state)).toEqual("errormsg");

    state = {
      api: {
        ...MOCK_STATE.api,
        init: { error: false },
        newUser: { error: false }
      }
    };

    expect(sel.apiError(state)).toEqual(false);

    // email
    expect(sel.loggedInAsEmail(MOCK_STATE)).toEqual("testme@email.com");

    expect(sel.email(MOCK_STATE)).toEqual("testme@email.com");

    state = { api: { ...MOCK_STATE.api, me: { response: { email: null } } } };

    expect(sel.email(state)).toEqual("testlogin@email.com");

    expect(sel.loggedInAsEmail(state)).toEqual(false);

    state = {
      api: {
        ...MOCK_STATE.api,
        me: { response: { email: null } },
        login: { payload: { email: null } }
      }
    };

    expect(sel.email(state)).toEqual(false);

    // username
    expect(sel.loggedInAsUsername(MOCK_STATE)).toEqual("testusername2");

    state = {
      api: {
        ...MOCK_STATE.api,
        changeUsername: { response: { username: null } }
      }
    };

    expect(sel.loggedInAsUsername(state)).toEqual("testusername");

    state = {
      api: {
        ...MOCK_STATE.api,
        changeUsername: { response: { username: null } },
        me: { response: { username: null } }
      }
    };

    expect(sel.loggedInAsUsername(state)).toEqual(false);

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
