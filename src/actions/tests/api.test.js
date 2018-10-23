import fetchMock from "fetch-mock";
import configureStore from "redux-mock-store";
import qs from "query-string";
import thunk from "redux-thunk";
import * as api from "../api";
import * as ea  from "../external_api";
import * as act from "../types";
import {
  done,
  setGetErrorResponse,
  setPostErrorResponse,
  setPostSuccessResponse,
  setPutSuccessResponse,
  setPutErrorResponse,
  setGetSuccessResponse,
  methods,
  RANDOM_SUCCESS_RESPONSE,
  RANDOM_ERROR_RESPONSE
} from "./helpers";
import { getHumanReadableError } from "../../helpers";
import { EDIT_USER_CLEAR_USER_PAYWALL } from "../../constants";

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
  const FAKE_PROPOSAL_VERSION = "2";
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
      },
      init: {
        response: {
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
    case methods.PUT:
      setPutSuccessResponse(path, options);
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
    case methods.PUT:
      setPutErrorResponse(path, options);
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

    //test it handles a success response
    setGetSuccessResponse(path);
    // test without pooling paywall flag
    await expect(api.requestApiInfo())
      .toDispatchActionsWithState(MOCK_STATE, [
        { type: act.REQUEST_INIT_SESSION, error: false },
        { type: act.RECEIVE_INIT_SESSION, error: false, payload: { csrfToken: null } },
        { type: act.REQUEST_ME, error: false }
      ], done);


    // test it handles an error and dispatch an action
    const store = mockStore(MOCK_STATE);
    setGetErrorResponse(path);
    localStorage.setItem("state", "any");
    await store.dispatch(api.requestApiInfo())
      .catch((e) => {
        expect(store.getActions()).toEqual([
          { type: act.REQUEST_INIT_SESSION, error: false },
          { type: act.RECEIVE_INIT_SESSION, error: true, payload: e }
        ]);
      });

  });


  test("on request me action", async () => {
    const successfulResponse = { ...FAKE_USER };
    const path = "/api/v1/user/me";
    fetchMock.get("/api/v1/user/me", successfulResponse);
    const { address, amount, txNotBefore } = FAKE_PAYWALL;

    // test it successfully handles the response and dispatch actions
    setGetSuccessResponse(path, {}, successfulResponse);
    await expect(api.onRequestMe())
      .toDispatchActionsWithState(MOCK_STATE, [
        { type: act.REQUEST_ME },
        { type: act.RECEIVE_ME,
          payload: { email: FAKE_USER.email, username: FAKE_USER.username }
        },
        ea.verifyUserPayment(address, amount, txNotBefore)
      ], done);

    //test it successfully handles the error response
    //test localstorage was cleaned up
    const store = getMockedStore();
    setGetErrorResponse(path);
    localStorage.setItem("state", "any");
    expect(localStorage.getItem("state")).toBeTruthy();
    await store.dispatch(api.onRequestMe())
      .catch((e) => {
        expect(store.getActions()).toBeEqual([
          { type: act.REQUEST_ME, error: false },
          { type: act.RECEIVE_ME, error: e }
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

  test("on get policy action", async () => {
    const path = "/api/v1/policy";
    //test it handles a successful response
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

  test("on search users action", async () => {
    const path = "/api/v1/users";
    const searchQuery = qs.stringify({ email: FAKE_USER.email });
    //test it handles a successful response
    await assertApiActionOnSuccess(
      path,
      api.onSearchUser,
      [searchQuery],
      [
        { type: act.REQUEST_USER_SEARCH, error: false },
        { type: act.RECEIVE_USER_SEARCH, error: false, payload: {} }
      ]
    );
  });

  test("on create a new user action", async () => {
    const path = "/api/v1/user/new";
    // fetchMock.restore();
    //test it handles a successful response
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
    await expect(api.onSignupConfirm(FAKE_USER))
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
        { type: act.RECEIVE_LOGIN, error: false }
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
    const params = [ FAKE_USER.password, FAKE_USER.username ];
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
    const params = [ FAKE_USER.password, "any" ];
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

  test("on fetch liked comments action", async () => {
    const path = `/api/v1/proposals/${FAKE_PROPOSAL_TOKEN}/commentsvotes`;
    const params = [FAKE_PROPOSAL_TOKEN];
    await assertApiActionOnSuccess(
      path,
      api.onFetchLikedComments,
      params,
      [
        { type: act.REQUEST_LIKED_COMMENTS },
        { type: act.RECEIVE_LIKED_COMMENTS, error: false, payload: {} }
      ]
    );
    await assertApiActionOnError(
      path,
      api.onFetchLikedComments,
      params,
      () => [
        { type: act.REQUEST_LIKED_COMMENTS, error: false, payload: FAKE_PROPOSAL_TOKEN },
        { type: act.RECEIVE_LIKED_COMMENTS, error: false, payload: {} }
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
    const params = [ FAKE_USER.email, FAKE_USER.id, FAKE_USER.username, FAKE_PROPOSAL_NAME, FAKE_PROPOSAL_DESCRIPTION, [] ];

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
    const params = [ FAKE_USER.email, FAKE_PROPOSAL_TOKEN, FAKE_COMMENT, parentId ];

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
    const params = [ FAKE_USER.email, FAKE_PROPOSAL_TOKEN, commentid, up_action ];

    // this needs a custom assertion for success response as the common one doesn't work for this case
    setPostSuccessResponse(path);
    const store = getMockedStore();
    await store.dispatch(api.onLikeComment.apply(null, params));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0].type).toEqual(act.REQUEST_LIKE_COMMENT);
    expect(dispatchedActions[1].type).toEqual(act.RECEIVE_SYNC_LIKE_COMMENT);

    await assertApiActionOnError(
      path,
      api.onLikeComment,
      params,
      (e) => [
        {
          type: act.REQUEST_LIKE_COMMENT,
          error: false,
          payload: { commentid, token: FAKE_PROPOSAL_TOKEN }
        },
        {
          type: act.RECEIVE_SYNC_LIKE_COMMENT,
          error: false,
          payload: { commentid, token: FAKE_PROPOSAL_TOKEN, action: up_action }
        },
        {
          type: act.RESET_SYNC_LIKE_COMMENT,
          error: false,
          payload: undefined
        },
        {
          error: true,
          payload: e,
          type: act.RECEIVE_LIKE_COMMENT
        }
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
    const params = [ FAKE_USER.email, verificationtoken ];

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
        {
          type: act.REQUEST_VERIFIED_KEY,
          error: false,
          payload: { email: FAKE_USER.email, verificationtoken }
        },
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

  test("on fetch votes status", async () => {
    const path = "/api/v1/proposals/votestatus";

    await assertApiActionOnSuccess(
      path,
      api.onFetchProposalsVoteStatus,
      [],
      [
        { type: act.REQUEST_PROPOSALS_VOTE_STATUS },
        { type: act.RECEIVE_PROPOSALS_VOTE_STATUS, error: false }
      ]
    );

    await assertApiActionOnError(
      path,
      api.onFetchProposalsVoteStatus,
      [],
      (e) => [
        { type: act.REQUEST_PROPOSALS_VOTE_STATUS, error: false, payload: undefined },
        { type: act.RECEIVE_PROPOSALS_VOTE_STATUS, error: true, payload: e }
      ]
    );
  });

  test("on fetch vote status for a single proposal", async () => {
    const path = "/api/v1/proposals/any/votestatus";
    const token = "any";
    const params = [token];

    await assertApiActionOnSuccess(
      path,
      api.onFetchProposalVoteStatus,
      params,
      [
        { type: act.REQUEST_PROPOSAL_VOTE_STATUS },
        { type: act.RECEIVE_PROPOSAL_VOTE_STATUS, error: false }
      ]
    );

    await assertApiActionOnError(
      path,
      api.onFetchProposalVoteStatus,
      params,
      (e) => [
        { type: act.REQUEST_PROPOSAL_VOTE_STATUS, error: false, payload: { token } },
        { type: act.RECEIVE_PROPOSAL_VOTE_STATUS, error: true, payload: e }
      ]
    );
  });

  test("on fetch user details action", async () => {
    const USER_ID = 0;
    const path = `/api/v1/user/${USER_ID}`;

    //test it handles a successful response
    await assertApiActionOnSuccess(
      path,
      api.onFetchUser,
      [USER_ID.toString()],
      [
        { type: act.REQUEST_USER },
        { type: act.RECEIVE_USER, error: false, payload: RANDOM_SUCCESS_RESPONSE }
      ]
    );
  });

  test("on edit user action", async () => {
    const path = "/api/v1/user/edit";

    //test it handles a successful response
    await assertApiActionOnSuccess(
      path,
      api.onEditUser,
      [ FAKE_USER.id, EDIT_USER_CLEAR_USER_PAYWALL ],
      [
        {
          type: act.REQUEST_EDIT_USER,
          payload: {
            userId: FAKE_USER.id,
            action: EDIT_USER_CLEAR_USER_PAYWALL
          }
        },
        { type: act.RECEIVE_EDIT_USER, error: false }
      ],
      {},
      methods.POST
    );
  });

  test("on edit proposal action", async () => {
    const path = "/api/v1/proposals/edit";
    const params = [ FAKE_USER.email, FAKE_PROPOSAL_NAME, FAKE_PROPOSAL_DESCRIPTION, [], FAKE_PROPOSAL_TOKEN ];

    // this needs a custom assertion for success response as the common one doesn't work for this case
    setPostSuccessResponse(path);
    const store = getMockedStore();
    await store.dispatch(api.onSubmitEditedProposal.apply(null, params));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0].type).toEqual(act.REQUEST_EDIT_PROPOSAL);
    expect(dispatchedActions[1].type).toEqual(act.RECEIVE_EDIT_PROPOSAL);
    expect(dispatchedActions[1].error).toBeFalsy();

    await assertApiActionOnError(
      path,
      api.onSubmitEditedProposal,
      params,
      (e) => [
        {
          type: act.REQUEST_EDIT_PROPOSAL,
          error: false,
          payload: { name: FAKE_PROPOSAL_NAME, description: FAKE_PROPOSAL_DESCRIPTION, files: [] }
        },
        { type: act.RECEIVE_EDIT_PROPOSAL, error: true, payload: e }
      ],
      {},
      methods.POST
    );

  });

  test("on authorize vote on proposal action", async () => {
    const path = "/api/v1/proposals/authorizevote";
    const params = [ FAKE_USER.email, FAKE_PROPOSAL_TOKEN, FAKE_PROPOSAL_VERSION ];

    const requestAction =
      {
        type: act.REQUEST_AUTHORIZE_VOTE,
        error: false,
        payload: {
          token: FAKE_PROPOSAL_TOKEN
        }
      };

    setPostSuccessResponse(path);
    const store = getMockedStore();
    await store.dispatch(api.onAuthorizeVote.apply(null, params));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0]).toEqual(requestAction);
    expect(dispatchedActions[1].type).toEqual(act.RECEIVE_AUTHORIZE_VOTE);
    expect(dispatchedActions[1].error).toBeFalsy();

    await assertApiActionOnError(
      path,
      api.onAuthorizeVote,
      params,
      (e) => [
        requestAction,
        { type: act.RECEIVE_AUTHORIZE_VOTE, error: true, payload: e }
      ],
      {},
      methods.POST
    );

  });

  test("test onFetchProposalPaywallPayment action", async () => {
    const path =  "/api/v1/proposals/paywallpayment";

    //test it handles a successful response
    await assertApiActionOnSuccess(
      path,
      api.onFetchProposalPaywallPayment,
      [],
      [
        { type: act.REQUEST_PROPOSAL_PAYWALL_PAYMENT },
        {
          type: act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT,
          error: false
        }
      ]
    );
  });

  test("test onRescanUserPayments", async () => {
    const path = "/api/v1/user/payments/rescan";
    const userid = "any";

    const requestAction = {
      type: act.REQUEST_RESCAN_USER_PAYMENTS,
      payload: userid,
      error: false
    };

    const mockSuccessResponse = {
      newcredits: [
        { paywallid: "any" }
      ]
    };
    setPutSuccessResponse(path, {}, mockSuccessResponse);
    const store = getMockedStore();
    await store.dispatch(api.onRescanUserPayments(userid));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0]).toEqual(requestAction);
    expect(dispatchedActions[1]).toEqual({
      type: act.RECEIVE_RESCAN_USER_PAYMENTS,
      error: false,
      payload: mockSuccessResponse
    });

    assertApiActionOnError(
      path,
      api.onRescanUserPayments,
      [userid],
      (e) => [
        requestAction,
        {
          type: act.RECEIVE_RESCAN_USER_PAYMENTS,
          error: true,
          payload: e
        }
      ],
      {},
      methods.PUT
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
