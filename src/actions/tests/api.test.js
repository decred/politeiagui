import fetchMock from "fetch-mock";
import configureStore from "redux-mock-store";
import qs from "query-string";
import thunk from "redux-thunk";
import * as api from "../api";
import * as app from "../app";
import * as ea  from "../external_api";
import * as act from "../types";
import {
  done,
  setGetErrorResponse,
  setPostErrorResponse,
  setPostSuccessResponse,
  setGetSuccessResponse,
  methods,
  RANDOM_SUCCESS_RESPONSE,
  RANDOM_ERROR_RESPONSE,
} from "./helpers";
import { getHumanReadableError } from "../../helpers";

const mockStore = configureStore([thunk]);

describe("test api actions (actions/api.js)", () => {
  const FAKE_PAYWALL = {
    address: "T_fake_address",
    amount: 10,
    txNotBefore: "any"
  };
  const FAKE_CSRF = "fake_csrf_token";
  const FAKE_PROPOSAL_NAME = "Fake prop name";
  const FAKE_PROPOSAL_DESCRIPTION = "Fake prop description";
  const FAKE_PROPOSAL_TOKEN = "fake_prop_token";
  const FAKE_COMMENT = "fake comment text";
  const FAKE_USER = {
    id: "2",
    email: "foo@bar.com",
    username: "foobar",
    password: "foobar1234"
  };
  const MOCK_STATE = {
    api: {
      me: {
        response: {
          paywalladdress: FAKE_PAYWALL.address,
          paywallamount: FAKE_PAYWALL.amount,
          paywalltxnotbefore: FAKE_PAYWALL.txNotBefore,
          csrfToken: FAKE_CSRF
        }
      }
    }
  };

  const getMockedStore = () => mockStore(MOCK_STATE);
  const assertApiActionOnSuccess = async (path, fn, params, expectedActions, options = {}, method = methods.GET) => {
    switch(method) {
    case methods.GET:
      setGetSuccessResponse(path, options);
      break;
    case methods.POST:
      setPostSuccessResponse(path, options);
      break;
    default:
      setGetSuccessResponse(path, options);
    }
    await expect(fn.apply(null, params))
      .toDispatchActionsWithState(MOCK_STATE, expectedActions, done);
  };
  const assertApiActionOnError = async (path, fn, params, callbackWithError, options = {}, method = methods.GET) => {
    switch(method) {
    case methods.GET:
      setGetErrorResponse(path, options);
      break;
    case methods.POST:
      setPostErrorResponse(path, options);
      break;
    default:
      setGetErrorResponse(path, options);
    }

    const store = getMockedStore();
    const expectedError = new Error(getHumanReadableError(RANDOM_ERROR_RESPONSE.errorcode));

    try {
      await store.dispatch(fn.apply(null, params));
      const expectedActions = callbackWithError(expectedError);
      expect(store.getActions()).toEqual(expectedActions);
    } catch(e) {
      const expectedActions = callbackWithError(e);
      expect(store.getActions()).toEqual(expectedActions);
    }

  };

  beforeEach(() => {
    //send status 200 to every unmatched request
    fetchMock.restore();
    fetchMock.post("/", {}).catch({});
    // define specific mocks for external apis to return responses as an array
    const { address } = FAKE_PAYWALL;
    setGetSuccessResponse(`https://testnet.dcrdata.org/api/address/${address}/raw`, {}, []);
    setGetSuccessResponse(`https://testnet.decred.org/api/addr/${address}/utxo?noCache=1`, {}, []);
  });

  test("request api info action", async () => {
    const path = "/api/";
    const poolPaywall = true;
    const { address, amount, txNotBefore } = FAKE_PAYWALL;

    //test it handles a success response
    setGetSuccessResponse(path);
    // test without pooling paywall flag
    await expect(api.requestApiInfo())
      .toDispatchActionsWithState(MOCK_STATE, [
        { type: act.RECEIVE_INIT_SESSION, error: false, payload: { csrfToken : "itsafake" } }
      ], done);

    // test it does pool paywall and dispatch actions
    await expect(api.requestApiInfo(poolPaywall))
      .toDispatchActionsWithState(MOCK_STATE, [
        { type: act.RECEIVE_INIT_SESSION, payload: { csrfToken : "itsafake" } },
        ea.verifyUserPayment(address, amount, txNotBefore)
      ], done);

    // test it handles an error and dispatch an action
    const store = mockStore(MOCK_STATE);
    setGetErrorResponse(path);
    localStorage.setItem("state", "any");
    await store.dispatch(api.requestApiInfo())
      .catch((e) => {
        expect(store.getActions()).toEqual([
          { type: act.RECEIVE_INIT_SESSION, error: true, payload: e },
        ]);
      });

  });

  test("on init action", async () => {
    const successfullResponse = { ...FAKE_USER };
    const path = "/api/v1/user/me";
    fetchMock.get("/api/v1/user/me", successfullResponse);

    // test it successfully handles the response and dispatch actions
    setGetSuccessResponse(path, {}, successfullResponse);
    await expect(api.onInit())
      .toDispatchActionsWithState(MOCK_STATE,[
        { type: act.REQUEST_ME },
        { type: act.RECEIVE_ME,
          payload: { email: FAKE_USER.email, username: FAKE_USER.username, csrfToken : "itsafake" }
        },
        { type: act.REQUEST_INIT_SESSION },
        api.requestApiInfo(true)
      ], done);

    //test it successfully handles the error response
    //test localstorage was cleaned up
    const store = getMockedStore();
    setGetErrorResponse(path);
    localStorage.setItem("state", "any");
    expect(localStorage.getItem("state")).toBeTruthy();
    await store.dispatch(api.onInit())
      .catch(() => {
        expect(store.getActions()).toBeEqual([
          { type: act.REQUEST_INIT_SESSION },
          api.requestApiInfo()
        ]);
        expect(localStorage.getItem("state")).toBeFalsy();
      });
  });

  test("update me action", () => {
    const payload = "any";
    expect(api.updateMe(payload))
      .toDispatchActions(
        { type: act.UPDATE_ME, payload },
        done
      );
  });

  test("on route change action", () => {
    expect(api.onRouteChange())
      .toDispatchActions(
        { type: act.CLEAN_ERRORS },
        done
      );
  });

  test("on get policy action", async () => {
    const path = "/api/v1/policy";
    //test it handles a successfull response
    await assertApiActionOnSuccess(
      path,
      api.onGetPolicy,
      [],
      [
        { type: act.REQUEST_POLICY },
        { type: act.RECEIVE_POLICY, error: false, payload: RANDOM_SUCCESS_RESPONSE }
      ]
    );

    //test it handles an error response
    await assertApiActionOnError(
      path,
      api.onGetPolicy,
      [],
      (e) => [
        { type: act.REQUEST_POLICY, error: false, payload: undefined },
        { type: act.RECEIVE_POLICY, error: true, payload: e }
      ]
    );
  });

  test("on create a new user action", async () => {
    const path = "/api/v1/user/new";
    // fetchMock.restore();
    //test it handles a successfull response
    await assertApiActionOnError(
      path,
      api.onCreateNewUser,
      [FAKE_USER],
      (e) => [
        { type: act.REQUEST_NEW_USER, payload: { email: FAKE_USER.email }, error: false },
        { type: act.RECEIVE_NEW_USER, error: true, payload: e }
      ],
      {},
      methods.POST
    );
    await assertApiActionOnSuccess(
      path,
      api.onCreateNewUser,
      [FAKE_USER],
      [
        { type: act.REQUEST_NEW_USER, payload: { email: FAKE_USER.email } },
        { type: act.RECEIVE_NEW_USER, error: false }
      ],
      {},
      methods.POST
    );
  });

  test("on verify new user action", async () => {
    const path = "/api/v1/user/verify";
    const verificationtoken = "any";
    const searchQuery = qs.stringify({ email: FAKE_USER.email, verificationtoken });

    await assertApiActionOnError(
      path,
      api.onVerifyNewUser,
      [searchQuery],
      (e) => [
        { type: act.REQUEST_VERIFY_NEW_USER, error: false, payload: searchQuery },
        { type: act.RECEIVE_VERIFY_NEW_USER, error: true, payload: e }
      ],
      {
        query: {
          email: FAKE_USER.email,
          verificationtoken
        }
      }
    );

    await assertApiActionOnSuccess(
      path,
      api.onVerifyNewUser,
      [searchQuery],
      [
        { type: act.REQUEST_VERIFY_NEW_USER, payload: searchQuery },
        { type: act.RECEIVE_VERIFY_NEW_USER, error: false }
      ],
      {
        query: {
          email: FAKE_USER.email,
          verificationtoken
        }
      }
    );
  });

  test("on signup action", async () => {
    await expect(api.onSignup(FAKE_USER))
      .toDispatchActionsWithState(MOCK_STATE, [
        api.onCreateNewUser(FAKE_USER)
      ], done);
  });

  test("on login action", async () => {
    const path = "/api/v1/login";
    await assertApiActionOnSuccess(
      path,
      api.onLogin,
      [FAKE_USER],
      [
        { type: act.REQUEST_LOGIN },
        { type: act.RECEIVE_LOGIN, error: false },
        api.onInit()
      ],
      {},
      methods.POST
    );
    await assertApiActionOnError(
      path,
      api.onLogin,
      [FAKE_USER],
      (e) => [
        { type: act.REQUEST_LOGIN, error: false, payload: { email: FAKE_USER.email } },
        { type: act.RECEIVE_LOGIN, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on logout action", async () => {
    const path = "/api/v1/logout";
    await assertApiActionOnSuccess(
      path,
      api.onLogout,
      [],
      [
        { type: act.REQUEST_LOGOUT },
        { type: act.RECEIVE_LOGOUT, error: false },
        api.onSetEmail("")
      ],
      {},
      methods.POST
    );
  });

  test("on change username action", async () => {
    const path = "/api/v1/user/username/change";
    const params = [FAKE_USER.password, FAKE_USER.username];
    await assertApiActionOnSuccess(
      path,
      api.onChangeUsername,
      params,
      [
        { type: act.REQUEST_CHANGE_USERNAME },
        { type: act.RECEIVE_CHANGE_USERNAME, error: false }
      ],
      {},
      methods.POST
    );
    await assertApiActionOnError(
      path,
      api.onChangeUsername,
      params,
      (e) => [
        { type: act.REQUEST_CHANGE_USERNAME, error: false, payload: undefined },
        { type: act.RECEIVE_CHANGE_USERNAME, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on change password action", async () => {
    const path = "/api/v1/user/password/change";
    const params = [ FAKE_USER.password, "any"];
    await assertApiActionOnSuccess(
      path,
      api.onChangePassword,
      params,
      [
        { type: act.REQUEST_CHANGE_PASSWORD },
        { type: act.RECEIVE_CHANGE_PASSWORD, error: false }
      ],
      {},
      methods.POST
    );
    await assertApiActionOnError(
      path,
      api.onChangePassword,
      params,
      (e) => [
        { type: act.REQUEST_CHANGE_PASSWORD, error: false, payload: undefined },
        { type: act.RECEIVE_CHANGE_PASSWORD, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on fetch user proposals action", async () => {
    const path = "/api/v1/user/proposals";
    const params = [FAKE_USER.id];
    await assertApiActionOnSuccess(
      path,
      api.onFetchUserProposals,
      params,
      [
        { type: act.REQUEST_USER_PROPOSALS },
        { type: act.RECEIVE_USER_PROPOSALS, error: false }
      ],
      {
        query: {
          userid: FAKE_USER.id
        }
      }
    );
    await assertApiActionOnError(
      path,
      api.onFetchUserProposals,
      params,
      (e) => [
        { type: act.REQUEST_USER_PROPOSALS, error: false, payload: undefined },
        { type: act.RECEIVE_USER_PROPOSALS, error: true, payload: e }
      ],
      {
        query: {
          userid: FAKE_USER.id
        }
      }
    );
  });

  test("on fetch vetted action", async () => {
    const path = "/api/v1/proposals/vetted";
    await assertApiActionOnSuccess(
      path,
      api.onFetchVetted,
      [],
      [
        { type: act.REQUEST_VETTED },
        { type: act.RECEIVE_VETTED, error: false }
      ]
    );
    await assertApiActionOnError(
      path,
      api.onFetchVetted,
      [],
      (e) => [
        { type: act.REQUEST_VETTED, error: false, payload: undefined },
        { type: act.RECEIVE_VETTED, error: true, payload: e }
      ]
    );
  });

  test("on fetch unvetted action", async () => {
    const path = "/api/v1/proposals/unvetted";
    await assertApiActionOnSuccess(
      path,
      api.onFetchUnvetted,
      [],
      [
        { type: act.REQUEST_UNVETTED },
        { type: act.RECEIVE_UNVETTED, error: false }
      ]
    );
    await assertApiActionOnError(
      path,
      api.onFetchUnvetted,
      [],
      (e) => [
        { type: act.REQUEST_UNVETTED, error: false, payload: undefined },
        { type: act.RECEIVE_UNVETTED, error: true, payload: e }
      ]
    );
  });

  test("on fetch proposal action", async () => {
    const path = `/api/v1/proposals/${FAKE_PROPOSAL_TOKEN}`;
    const params = [FAKE_PROPOSAL_TOKEN];
    await assertApiActionOnSuccess(
      path,
      api.onFetchProposal,
      params,
      [
        { type: act.REQUEST_PROPOSAL },
        { type: act.RECEIVE_PROPOSAL, error: false }
      ]
    );
    await assertApiActionOnError(
      path,
      api.onFetchProposal,
      params,
      (e) => [
        { type: act.REQUEST_PROPOSAL, error: false, payload: FAKE_PROPOSAL_TOKEN },
        { type: act.RECEIVE_PROPOSAL, error: true, payload: e }
      ]
    );
  });

  test("on fetch proposal comments", async () => {
    const path = `/api/v1/proposals/${FAKE_PROPOSAL_TOKEN}/comments`;
    const params = [FAKE_PROPOSAL_TOKEN];
    await assertApiActionOnSuccess(
      path,
      api.onFetchProposalComments,
      params,
      [
        { type: act.REQUEST_PROPOSAL_COMMENTS },
        { type: act.RECEIVE_PROPOSAL_COMMENTS, error: false }
      ]
    );
    await assertApiActionOnError(
      path,
      api.onFetchProposalComments,
      params,
      (e) => [
        { type: act.REQUEST_PROPOSAL_COMMENTS, error: false, payload: FAKE_PROPOSAL_TOKEN },
        { type: act.RECEIVE_PROPOSAL_COMMENTS, error: true, payload: e }
      ]
    );
  });

  test("on submit proposal", async () => {
    const path = "/api/v1/proposals/new";
    const params = [FAKE_USER.email, FAKE_USER.id, FAKE_USER.username, FAKE_PROPOSAL_NAME, FAKE_PROPOSAL_DESCRIPTION, []];

    // this needs a custom assertion for success response as the common one doesn't work for this case
    setPostSuccessResponse(path);
    const store = getMockedStore();
    await store.dispatch(api.onSubmitProposal.apply(null, params));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0].type).toEqual(act.REQUEST_NEW_PROPOSAL);
    expect(dispatchedActions[1].type).toEqual(act.RECEIVE_NEW_PROPOSAL);
    expect(dispatchedActions[1].error).toBeFalsy();


    await assertApiActionOnError(
      path,
      api.onSubmitProposal,
      params,
      (e) => [
        {
          type: act.REQUEST_NEW_PROPOSAL,
          error: false,
          payload: { name: FAKE_PROPOSAL_NAME, description: FAKE_PROPOSAL_DESCRIPTION, files: [] }
        },
        { type: act.RECEIVE_NEW_PROPOSAL, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on submit comment action", async () => {
    const path = "/api/v1/comments/new";
    const parentId= 0;
    const params = [FAKE_USER.email, FAKE_PROPOSAL_TOKEN, FAKE_COMMENT, parentId];

    // this needs a custom assertion for success response as the common one doesn't work for this case
    setPostSuccessResponse(path);
    const store = getMockedStore();
    await store.dispatch(api.onSubmitComment.apply(null, params));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0].type).toEqual(act.REQUEST_NEW_COMMENT);
    expect(dispatchedActions[1].type).toEqual(act.RECEIVE_NEW_COMMENT);
    expect(dispatchedActions[1].error).toBeFalsy();

    await assertApiActionOnError(
      path,
      api.onSubmitComment,
      params,
      (e) => [
        {
          type: act.REQUEST_NEW_COMMENT,
          error: false,
          payload: { token: FAKE_PROPOSAL_TOKEN, comment: FAKE_COMMENT, parentid: parentId }
        },
        { type: act.RECEIVE_NEW_COMMENT, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on like comment action", async () => {
    const path = "/api/v1/comments/like";
    const commentid = 0;
    const up_action = 1;
    //const down_action = -1;
    const params = [FAKE_USER.email, FAKE_PROPOSAL_TOKEN, up_action, commentid ];

    // this needs a custom assertion for success response as the common one doesn't work for this case
    setPostSuccessResponse(path);
    const store = getMockedStore();
    await store.dispatch(api.onLikeComment.apply(null, params));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0].type).toEqual(act.RECEIVE_LIKE_COMMENT);
    expect(dispatchedActions[0].error).toBeFalsy();

    await assertApiActionOnError(
      path,
      api.onLikeComment,
      params,
      (e) => [
        { type: act.RECEIVE_LIKE_COMMENT, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on update user key", async () => {
    const path = "/api/v1/user/key";
    const params = [FAKE_USER.email];

    // this needs a custom assertion for success response as the common one doesn't work for this case
    setPostSuccessResponse(path);
    const store = getMockedStore();
    await store.dispatch(api.onUpdateUserKey.apply(null, params));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0].type).toEqual(act.REQUEST_UPDATED_KEY);
    expect(dispatchedActions[1].type).toEqual(act.RECEIVE_UPDATED_KEY);
    expect(dispatchedActions[1].error).toBeFalsy();

    await assertApiActionOnError(
      path,
      api.onUpdateUserKey,
      params,
      (e) => [
        { type: act.REQUEST_UPDATED_KEY, error: false, payload: undefined },
        { type: act.RECEIVE_UPDATED_KEY, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on verify user key", async () => {
    const path = "/api/v1/user/key/verify";
    const verificationtoken = "any";
    const params = [FAKE_USER.email, verificationtoken];

    // this needs a custom assertion for success response as the common one doesn't work for this case
    setPostSuccessResponse(path);
    const store = getMockedStore();
    await store.dispatch(api.onVerifyUserKey.apply(null, params));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0].type).toEqual(act.REQUEST_VERIFIED_KEY);
    expect(dispatchedActions[1].type).toEqual(act.RECEIVE_VERIFIED_KEY);
    expect(dispatchedActions[1].error).toBeFalsy();

    await assertApiActionOnError(
      path,
      api.onVerifyUserKey,
      params,
      (e) => [
        { type: act.REQUEST_VERIFIED_KEY, error: false, payload: undefined },
        { type: act.RECEIVE_VERIFIED_KEY, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("redirected From action ", () => {
    expect(api.redirectedFrom("any")).toDispatchActions({
      type: act.REDIRECTED_FROM, payload: "any"
    }, done);
  });

  test("reset redirected from action", () => {
    expect(api.resetRedirectedFrom())
      .toDispatchActions([
        { type: act.RESET_REDIRECTED_FROM }
      ], done);
  });

  test("on forgotten password request action", async () => {
    const path = "/api/v1/user/password/reset";
    const params = [FAKE_USER];

    await assertApiActionOnSuccess(
      path,
      api.onForgottenPasswordRequest,
      params,
      [
        { type: act.REQUEST_FORGOTTEN_PASSWORD_REQUEST },
        { type: act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST, error: false }
      ],
      {},
      methods.POST
    );

    await assertApiActionOnError(
      path,
      api.onForgottenPasswordRequest,
      params,
      (e) => [
        {
          type: act.REQUEST_FORGOTTEN_PASSWORD_REQUEST,
          error: false,
          payload: { email: FAKE_USER.email }
        },
        { type: act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("reset forgotten password action", () => {
    expect(api.resetForgottenPassword())
      .toDispatchActions(
        { type: act.RESET_FORGOTTEN_PASSWORD_REQUEST },
        done
      );
  });

  test("on password reset request action", async () => {
    const path = "/api/v1/user/password/reset";
    const verificationtoken = "any";
    const { email, password } = FAKE_USER;
    const params = [{
      email,
      verificationtoken,
      newpassword: password
    }];

    await assertApiActionOnSuccess(
      path,
      api.onPasswordResetRequest,
      params,
      [
        { type: act.REQUEST_PASSWORD_RESET_REQUEST },
        { type: act.RECEIVE_PASSWORD_RESET_REQUEST, error: false }
      ],
      {},
      methods.POST
    );

    await assertApiActionOnError(
      path,
      api.onPasswordResetRequest,
      params,
      (e) => [
        {
          type: act.REQUEST_PASSWORD_RESET_REQUEST,
          error: false,
          payload: { email, verificationtoken, newpassword: password }
        },
        { type: act.RECEIVE_PASSWORD_RESET_REQUEST, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on key mismatch action", () => {
    expect(api.keyMismatch("any"))
      .toDispatchActions(
        { type: act.KEY_MISMATCH, payload: "any" },
        done
      );
  });

  test("reset passsword request action", () => {
    expect(api.resetPasswordReset())
      .toDispatchActions(
        { type: act.RESET_PASSWORD_RESET_REQUEST },
        done
      );
  });

  test("verify user payment with politeia action", async () => {
    // TODO: verify if this function can be improved to dispatch actions
    // as all other api request actions currently do
  });

  test("on fetch active votes", async () => {
    const path = "/api/v1/proposals/activevote";
    const mockedResponse = { votes: [] };

    fetchMock.get(path, mockedResponse);
    expect(api.onFetchActiveVotes()).toDispatchActionsWithState(MOCK_STATE,[
      { type: act.REQUEST_ACTIVE_VOTES },
      { type: act.RECEIVE_ACTIVE_VOTES, error: false },
      app.updateVotesEndHeightFromActiveVotes(mockedResponse)
    ], done);

    await assertApiActionOnError(
      path,
      api.onFetchActiveVotes,
      [],
      (e) => [
        { type: act.REQUEST_ACTIVE_VOTES, error: false, payload: undefined },
        { type: act.RECEIVE_ACTIVE_VOTES, error: true, payload: e }
      ]
    );
  });

  test("on fetch vote results", async () => {
    const path = "/api/v1/proposals/any/votes";
    const token = "any";
    const params = [token];
    const mockedResponse = {
      startvotereply: {
        endheight: 303322
      }
    };
    //set custom response
    fetchMock.get(path, mockedResponse);
    expect(api.onFetchVoteResults(token)).toDispatchActions([
      { type: act.REQUEST_VOTE_RESULTS },
      { type: act.RECEIVE_VOTE_RESULTS, error: false },
      app.setVotesEndHeight(token, mockedResponse.startvotereply.endheight)
    ], done);

    await assertApiActionOnError(
      path,
      api.onFetchVoteResults,
      params,
      (e) => [
        { type: act.REQUEST_VOTE_RESULTS, error: false, payload: { token } },
        { type: act.RECEIVE_VOTE_RESULTS, error: true, payload: e }
      ]
    );
  });

  // TODO: for the following tests
  // needs to decouple modal confirmation from the
  // actions so it can be tested
  // test("on start vote", async () => {
  // });
  // test("on submit status proposal", () => {
  // });
});
