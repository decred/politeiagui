import * as sel from "../api";


describe("test api selectors", () => {
  const FAKE_USER = {
    email: "test@emai"
  };

  const FAKE_PAYWALL = {
    address: "T_fake_address",
    amount: 10,
    txNotBefore: "any"
  };

  const FAKE_PUBKEY = "fake_pub_key";

  const FAKE_CSRF = "fake_csrf_token";

  const MOCK_STATE = {
    api: {
      newUser: {
        payload: {
          email: FAKE_USER.email
        },
        response: "rdata",
        error: "errormsg"
      },
      me: {
        response: {
          paywalladdress: FAKE_PAYWALL.address,
          paywallamount: FAKE_PAYWALL.amount,
          paywalltxnotbefore: FAKE_PAYWALL.txNotBefore,
          csrfToken: FAKE_CSRF,
          publicKey: FAKE_PUBKEY
        }
      },
      init: {
        isRequesting: true,
        response: {
          csrfToken: FAKE_CSRF,
          testnet: true,
          pubkey: FAKE_PUBKEY
        }
      },
      forgottenPassword: {
        payload: {
          email: FAKE_USER.email
        }
      },
      proposalPaywallDetails: {
        response: {
          paywalladdress: FAKE_PAYWALL.address,
          paywalltxnotbefore: FAKE_PAYWALL.txNotBefore
        }
      },
      resendVerificationEmail: {
        payload: {
          email: FAKE_USER.email
        }
      }
    }
  };


  test("testing getApi methods", () => {

    //isApiRequesting
    expect(sel.getIsApiRequesting("init")({})).toEqual(false);
    expect(sel.getIsApiRequesting("init")(MOCK_STATE)).toEqual(true);

    //apiPayload
    expect(sel.getApiPayload("newUser")({})).toEqual(undefined);
    expect(sel.getApiPayload("newUser")(MOCK_STATE)).toEqual(MOCK_STATE.api.newUser.payload);

    //apiResponse
    expect(sel.getApiResponse("newUser")({})).toEqual(undefined);
    expect(sel.getApiResponse("newUser")(MOCK_STATE)).toEqual("rdata");

    //apiError
    expect(sel.getApiError("newUser")({})).toEqual(undefined);
    expect(sel.getApiError("newUser")(MOCK_STATE)).toEqual("errormsg");

  });

  test("testing composing selectors", () => {

    expect(sel.proposalPaywallAddress(MOCK_STATE)).toEqual(FAKE_PAYWALL.address);

    expect(sel.proposalPaywallTxNotBefore(MOCK_STATE)).toEqual(FAKE_PAYWALL.txNotBefore);

    expect(sel.csrf(MOCK_STATE)).toEqual(FAKE_CSRF);

    expect(sel.newUserEmail(MOCK_STATE)).toEqual(FAKE_USER.email);

    expect(sel.forgottenPassEmail(MOCK_STATE)).toEqual(FAKE_USER.email);

    expect(sel.emailForResendVerification(MOCK_STATE)).toEqual(FAKE_USER.email);

    expect(sel.isTestNet(MOCK_STATE)).toEqual(true);

    expect(sel.serverPubkey(MOCK_STATE)).toEqual(FAKE_PUBKEY);

    expect(sel.userPubkey(MOCK_STATE)).toEqual(FAKE_PUBKEY);

  });

});
