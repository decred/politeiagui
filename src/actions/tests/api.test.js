import fetchMock from "fetch-mock";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as api from "../api";
import * as pki from "../../lib/pki";
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
import { MANAGE_USER_CLEAR_USER_PAYWALL } from "../../constants";

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
    comments: {
      comments: {
        byToken: {
          [FAKE_PROPOSAL_TOKEN]: []
        }
      }
    },
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
  const assertApiActionOnSuccess = async (
    path,
    fn,
    params,
    expectedActions,
    options = {},
    method = methods.GET
  ) => {
    switch (method) {
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

    await expect(fn.apply(null, params)).toDispatchActionsWithState(
      MOCK_STATE,
      expectedActions,
      (e) => {
        if (e) {
          console.log(
            "Action was supposed to be success but instead was errored:",
            e
          );
        }
      }
    );
  };
  const assertApiActionOnError = async (
    path,
    fn,
    params,
    callbackWithError,
    options = {},
    method = methods.GET
  ) => {
    switch (method) {
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
    const expectedError = new Error(
      getHumanReadableError(RANDOM_ERROR_RESPONSE.errorcode)
    );

    try {
      await store.dispatch(fn.apply(null, params));
      const expectedActions = callbackWithError(expectedError);
      expect(store.getActions()).toEqual(expectedActions);
    } catch (e) {
      const expectedActions = callbackWithError(e);
      expect(store.getActions()).toEqual(expectedActions);
    }
  };

  beforeEach(() => {
    //send status 200 to every unmatched request
    fetchMock.restore();
    fetchMock.postOnce("/", {}).catch({});
  });

  test("request api info action", async () => {
    const path = "/api/";

    //test it handles a success response
    setGetSuccessResponse(path);
    // test without pooling paywall flag
    await expect(api.requestApiInfo(false)).toDispatchActionsWithState(
      MOCK_STATE,
      [
        { type: act.REQUEST_INIT_SESSION, error: false },
        {
          type: act.RECEIVE_INIT_SESSION,
          error: false,
          payload: { csrfToken: null }
        }
      ],
      done
    );

    // test it handles an error and dispatch an action
    const store = mockStore(MOCK_STATE);
    setGetErrorResponse(path);
    localStorage.setItem("state", "any");
    await store.dispatch(api.requestApiInfo()).catch((e) => {
      expect(store.getActions()).toEqual([
        { type: act.REQUEST_INIT_SESSION, error: false },
        { type: act.RECEIVE_INIT_SESSION, error: true, payload: e }
      ]);
    });
  });

  test("on request me action", async () => {
    const successfulResponse = { ...FAKE_USER };
    const path = "path:/api/v1/user/me";
    setGetSuccessResponse(path, {}, successfulResponse);

    assertApiActionOnSuccess(
      path,
      api.onRequestMe,
      [],
      [
        { type: act.REQUEST_ME },
        {
          type: act.RECEIVE_ME,
          payload: { success: true }
        }
      ]
    );

    //test it successfully handles the error response
    //test localstorage was cleaned up
    const store = getMockedStore();
    setGetErrorResponse(path);
    localStorage.setItem("state", "any");
    expect(localStorage.getItem("state")).toBeTruthy();
    await store.dispatch(api.onRequestMe()).catch((e) => {
      expect(store.getActions()).toEqual([
        { type: act.REQUEST_ME, error: false, payload: undefined },
        { type: act.RECEIVE_ME, error: true, payload: e }
      ]);
      expect(localStorage.getItem("state")).toBeFalsy();
    });
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
        {
          type: act.RECEIVE_POLICY,
          error: false,
          payload: RANDOM_SUCCESS_RESPONSE
        }
      ]
    );

    //test it handles an error response
    await assertApiActionOnError(path, api.onGetPolicy, [], (e) => [
      { type: act.REQUEST_POLICY, error: false, payload: undefined },
      { type: act.RECEIVE_POLICY, error: true, payload: e }
    ]);
  });

  test("on search users action", async () => {
    const path = "path:/api/v1/users";
    const searchQuery = { email: FAKE_USER.email };
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
    const path = "path:/api/v1/user/new";

    setPostSuccessResponse(path);
    //test it handles a successful response
    const store = getMockedStore();
    await store.dispatch(api.onCreateNewUser(FAKE_USER));
    expect(store.getActions()).toEqual([
      {
        type: act.REQUEST_NEW_USER,
        payload: { email: FAKE_USER.email },
        error: false
      },
      { type: act.RECEIVE_NEW_USER, error: false, payload: { success: true } },
      { type: act.CLOSE_MODAL }
    ]);

    await assertApiActionOnError(
      path,
      api.onCreateNewUser,
      [FAKE_USER],
      (e) => [
        {
          type: act.REQUEST_NEW_USER,
          payload: { email: FAKE_USER.email },
          error: false
        },
        { type: act.RECEIVE_NEW_USER, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on verify new user action", async () => {
    const path = "/api/v1/user/verify";
    const verificationToken = "any";
    const { email } = FAKE_USER;

    await assertApiActionOnError(
      path,
      api.onVerifyNewUser,
      [email, verificationToken],
      (e) => [
        {
          type: act.REQUEST_VERIFY_NEW_USER,
          error: false,
          payload: { email, verificationToken }
        },
        { type: act.RECEIVE_VERIFY_NEW_USER, error: true, payload: e }
      ],
      {
        query: {
          email,
          verificationToken
        }
      }
    );

    await assertApiActionOnSuccess(
      path,
      api.onVerifyNewUser,
      [email, verificationToken],
      [
        {
          type: act.REQUEST_VERIFY_NEW_USER,
          payload: { email, verificationToken }
        },
        { type: act.RECEIVE_VERIFY_NEW_USER, error: false }
      ],
      {
        query: {
          email,
          verificationToken
        }
      }
    );
  });

  test("on login action", async () => {
    setGetSuccessResponse("path:/api/v1/user/me");
    const path = "/api/v1/login";
    await assertApiActionOnSuccess(
      path,
      api.onLogin,
      [FAKE_USER],
      [{ type: act.REQUEST_LOGIN }, { type: act.RECEIVE_LOGIN, error: false }],
      {},
      methods.POST
    );
    await assertApiActionOnError(
      path,
      api.onLogin,
      [FAKE_USER],
      (e) => [
        {
          type: act.REQUEST_LOGIN,
          error: false,
          payload: { email: FAKE_USER.email }
        },
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
    const params = [FAKE_USER.password, "any"];
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

  test("on fetch liked comments action", async () => {
    const path = `path:/api/v1/user/proposals/${FAKE_PROPOSAL_TOKEN}/commentslikes`;
    const params = [FAKE_PROPOSAL_TOKEN, FAKE_USER.id];
    // fetchMock.get(path, {}, { query: {
    //   userid: FAKE_USER.id
    // } })
    await assertApiActionOnSuccess(path, api.onFetchLikedComments, params, [
      { type: act.REQUEST_LIKED_COMMENTS },
      {
        type: act.RECEIVE_LIKED_COMMENTS,
        error: false,
        payload: { token: FAKE_PROPOSAL_TOKEN }
      }
    ]);
    await assertApiActionOnError(
      path,
      api.onFetchLikedComments,
      params,
      (e) => [
        {
          type: act.REQUEST_LIKED_COMMENTS,
          error: false,
          payload: FAKE_PROPOSAL_TOKEN
        },
        {
          type: act.RECEIVE_LIKED_COMMENTS,
          error: true,
          payload: e
        }
      ]
    );
  });

  test("on fetch proposal action", async () => {
    const path = `/api/v1/proposals/${FAKE_PROPOSAL_TOKEN}`;
    const params = [FAKE_PROPOSAL_TOKEN];
    await assertApiActionOnSuccess(path, api.onFetchProposal, params, [
      { type: act.REQUEST_PROPOSAL }
    ]);
    await assertApiActionOnError(path, api.onFetchProposal, params, (e) => [
      {
        type: act.REQUEST_PROPOSAL,
        error: false,
        payload: FAKE_PROPOSAL_TOKEN
      },
      { type: act.RECEIVE_PROPOSAL, error: true, payload: e }
    ]);
  });

  test("on fetch proposal comments", async () => {
    const path = `/api/v1/proposals/${FAKE_PROPOSAL_TOKEN}/comments`;
    const params = [FAKE_PROPOSAL_TOKEN];
    await assertApiActionOnSuccess(path, api.onFetchProposalComments, params, [
      { type: act.REQUEST_RECORD_COMMENTS },
      { type: act.RECEIVE_RECORD_COMMENTS, error: false }
    ]);
    await assertApiActionOnError(
      path,
      api.onFetchProposalComments,
      params,
      (e) => [
        {
          type: act.REQUEST_RECORD_COMMENTS,
          error: false,
          payload: FAKE_PROPOSAL_TOKEN
        },
        { type: act.RECEIVE_RECORD_COMMENTS, error: true, payload: e }
      ]
    );
  });

  test("on submit proposal", async () => {
    const path = "/api/v1/proposals/new";
    const params = [
      FAKE_USER.email,
      FAKE_USER.id,
      FAKE_USER.username,
      FAKE_PROPOSAL_NAME,
      FAKE_PROPOSAL_DESCRIPTION,
      []
    ];

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
          payload: {
            name: FAKE_PROPOSAL_NAME,
            description: FAKE_PROPOSAL_DESCRIPTION,
            files: []
          }
        },
        { type: act.RECEIVE_NEW_PROPOSAL, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on submit comment action", async () => {
    const path = "/api/v1/comments/new";
    const parentId = 0;
    const params = [
      FAKE_USER.email,
      FAKE_PROPOSAL_TOKEN,
      FAKE_COMMENT,
      parentId
    ];
    const keys = await pki.generateKeys(FAKE_USER.email);
    await pki.loadKeys(FAKE_USER.email, keys);

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
          payload: {
            token: FAKE_PROPOSAL_TOKEN,
            comment: FAKE_COMMENT,
            parentid: parentId
          }
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
    const params = [FAKE_USER.email, FAKE_PROPOSAL_TOKEN, commentid, up_action];

    // this needs a custom assertion for success response as the common one doesn't work for this case
    setPostSuccessResponse(path);
    const store = getMockedStore();
    await store.dispatch(api.onLikeComment.apply(null, params));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0].type).toEqual(act.REQUEST_LIKE_COMMENT);
    expect(dispatchedActions[1].type).toEqual(act.RECEIVE_SYNC_LIKE_COMMENT);

    const keys = await pki.generateKeys(FAKE_USER.email);
    await pki.loadKeys(FAKE_USER.email, keys);

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
          payload: { token: FAKE_PROPOSAL_TOKEN }
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
    const params = [FAKE_USER.email, verificationtoken];

    const keys = await pki.generateKeys(FAKE_USER.email);
    await pki.loadKeys(FAKE_USER.email, keys);

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
    expect(api.redirectedFrom("any")).toDispatchActions(
      {
        type: act.REDIRECTED_FROM,
        payload: "any"
      },
      done
    );
  });

  test("reset redirected from action", () => {
    expect(api.resetRedirectedFrom()).toDispatchActions(
      [{ type: act.RESET_REDIRECTED_FROM }],
      done
    );
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
        {
          type: act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST,
          error: true,
          payload: e
        }
      ],
      {},
      methods.POST
    );
  });

  test("on password reset request action", async () => {
    const path = "/api/v1/user/password/reset";
    const verificationtoken = "any";
    const { email, password } = FAKE_USER;
    const params = [
      {
        email,
        verificationtoken,
        newpassword: password
      }
    ];

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
    expect(api.keyMismatch("any")).toDispatchActions(
      { type: act.KEY_MISMATCH, payload: "any" },
      done
    );
  });

  test("reset passsword request action", () => {
    expect(api.resetPasswordReset()).toDispatchActions(
      { type: act.RESET_RESET_PASSWORD },
      done
    );
  });

  test("verify user payment with politeia action", async () => {
    // TODO: verify if this function can be improved to dispatch actions
    // as all other api request actions currently do
  });

  test("on fetch user details action", async () => {
    const USER_ID = "6193b76b-4834-48c3-886e-f201af6dae7d";
    const path = `/api/v1/user/${USER_ID}`;

    //test it handles a successful response
    await assertApiActionOnSuccess(
      path,
      api.onFetchUser,
      [USER_ID],
      [
        { type: act.RESET_EDIT_USER, error: false },
        { type: act.REQUEST_USER, error: false, payload: USER_ID },
        {
          type: act.RECEIVE_USER,
          error: false
        }
      ]
    );
  });

  test("on manage user action", async () => {
    const path = "/api/v1/user/manage";

    //test it handles a successful response
    await assertApiActionOnSuccess(
      path,
      api.onManageUser,
      [FAKE_USER.id, MANAGE_USER_CLEAR_USER_PAYWALL],
      [
        {
          type: act.REQUEST_MANAGE_USER,
          payload: {
            userId: FAKE_USER.id,
            action: MANAGE_USER_CLEAR_USER_PAYWALL
          }
        },
        { type: act.RECEIVE_MANAGE_USER, error: false }
      ],
      {},
      methods.POST
    );
  });

  test("on edit proposal action", async () => {
    const path = "/api/v1/proposals/edit";
    const params = [
      FAKE_USER.email,
      FAKE_PROPOSAL_NAME,
      FAKE_PROPOSAL_DESCRIPTION,
      [],
      FAKE_PROPOSAL_TOKEN
    ];
    const keys = await pki.generateKeys(FAKE_USER.email);
    await pki.loadKeys(FAKE_USER.email, keys);

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
          payload: {
            name: FAKE_PROPOSAL_NAME,
            description: FAKE_PROPOSAL_DESCRIPTION,
            files: []
          }
        },
        { type: act.RECEIVE_EDIT_PROPOSAL, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on authorize vote on proposal action", async () => {
    const path = "/api/v1/proposals/authorizevote";
    const params = [
      FAKE_USER.email,
      FAKE_PROPOSAL_TOKEN,
      FAKE_PROPOSAL_VERSION
    ];
    const requestAction = {
      type: act.REQUEST_AUTHORIZE_VOTE,
      error: false,
      payload: {
        token: FAKE_PROPOSAL_TOKEN
      }
    };
    const keys = await pki.generateKeys(FAKE_USER.email);
    await pki.loadKeys(FAKE_USER.email, keys);

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
    const path = "/api/v1/proposals/paywallpayment";

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
      newcredits: [{ paywallid: "any" }],
      userid
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
