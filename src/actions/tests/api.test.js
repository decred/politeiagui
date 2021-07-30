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
  restoreFetchMock,
  methods,
  RANDOM_SUCCESS_RESPONSE,
  RANDOM_ERROR_RESPONSE
} from "./helpers";
import {
  MANAGE_USER_CLEAR_USER_PAYWALL,
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_STATE_VETTED
} from "../../constants";

const mockStore = configureStore([thunk]);

describe("test api actions (actions/api.js)", () => {
  const FAKE_PAYWALL = {
    address: "T_fake_address",
    amount: 10,
    txNotBefore: "any"
  };
  const FAKE_CSRF = "fake_csrf_token";
  const FAKE_PROPOSAL_NAME = "Fake prop name";
  const FAKE_PROPOSAL_AMOUNT = 2000000;
  const FAKE_PROPOSAL_STARTDATE = 0;
  const FAKE_PROPOSAL_ENDDATE = 0;
  const FAKE_PROPOSAL_DOMAIN = "development";
  const FAKE_PROPOSAL_TYPE = PROPOSAL_TYPE_REGULAR;
  const FAKE_RFP_DEADLINE = undefined;
  const FAKE_RFP_LINK = undefined;
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
    app: {
      me: {
        paywalladdress: FAKE_PAYWALL.address,
        paywallamount: FAKE_PAYWALL.amount,
        paywalltxnotbefore: FAKE_PAYWALL.txNotBefore,
        csrfToken: FAKE_CSRF
      },
      init: {
        csrfToken: FAKE_CSRF
      }
    },
    users: {
      byID: {
        [FAKE_USER.id]: FAKE_USER
      },
      currentUserID: FAKE_USER.id
    }
  };

  const getMockedStore = () => mockStore(MOCK_STATE);
  const assertApiActionOnSuccess = async (
    path,
    fn,
    params,
    expectedActions,
    options = {},
    method = methods.GET,
    response = RANDOM_SUCCESS_RESPONSE
  ) => {
    switch (method) {
      case methods.GET:
        setGetSuccessResponse(path, options, response);
        break;
      case methods.POST:
        setPostSuccessResponse(path, options, response);
        break;
      case methods.PUT:
        setPutSuccessResponse(path, options, response);
        break;
      default:
        setGetSuccessResponse(path, options, response);
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
    try {
      await store.dispatch(fn.apply(null, params));
      const expectedActions = callbackWithError(
        RANDOM_ERROR_RESPONSE.errorcode
      );
      expect(store.getActions()).toEqual(expectedActions);
    } catch (e) {
      const expectedActions = callbackWithError(e);
      expect(store.getActions()).toEqual(expectedActions);
    }
  };

  beforeEach(() => {
    restoreFetchMock();
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
    const path = "/api/v1/user/me";
    await assertApiActionOnSuccess(
      path,
      api.onRequestMe,
      [],
      [
        { type: act.REQUEST_ME },
        {
          type: act.RECEIVE_ME,
          payload: { ...FAKE_USER }
        }
      ],
      methods.GET,
      {},
      { ...FAKE_USER }
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
    //test it handles a successful response
    setPostSuccessResponse("/api/ticketvote/v1/policy");
    setPostSuccessResponse("/api/comments/v1/policy");
    setPostSuccessResponse("/api/pi/v1/policy");
    const path = "/api/v1/policy";
    await assertApiActionOnSuccess(
      path,
      api.onGetPolicy,
      [],
      [
        { type: act.REQUEST_POLICY, error: false },
        {
          type: act.RECEIVE_POLICY,
          error: false,
          payload: {
            www: RANDOM_SUCCESS_RESPONSE,
            ticketvote: RANDOM_SUCCESS_RESPONSE,
            comments: RANDOM_SUCCESS_RESPONSE,
            pi: RANDOM_SUCCESS_RESPONSE
          }
        }
      ]
    );

    //test it handles an error response
    setPostErrorResponse("/api/ticketvote/v1/policy");
    setPostErrorResponse("/api/comments/v1/policy");
    setPostErrorResponse("/api/pi/v1/policy");
    await assertApiActionOnError(path, api.onGetPolicy, [], (errorcode) => [
      { type: act.REQUEST_POLICY, error: false, payload: undefined },
      {
        type: act.RECEIVE_POLICY,
        error: true,
        payload: errorcode
      }
    ]);
  });

  test("on search users action", async () => {
    const path = `/api/v1/users?email=${encodeURIComponent(FAKE_USER.email)}`;
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
    const path = "/api/v1/user/new";
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
      { type: act.RECEIVE_NEW_USER, error: false, payload: { success: true } }
    ]);

    await assertApiActionOnError(
      path,
      api.onCreateNewUser,
      [FAKE_USER],
      (errorcode) => [
        {
          type: act.REQUEST_NEW_USER,
          payload: { email: FAKE_USER.email },
          error: false
        },
        { type: act.RECEIVE_NEW_USER, error: true, payload: errorcode }
      ],
      {},
      methods.POST
    );
  });

  test("on verify new user action", async () => {
    const path = "/api/v1/user/verify";
    const verificationToken = "any";
    const { email, username } = FAKE_USER;

    await assertApiActionOnError(
      path,
      api.onVerifyNewUser,
      [email, verificationToken, username],
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
      [email, verificationToken, username],
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
    setGetSuccessResponse("/api/v1/user/me");
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
        { type: act.RECEIVE_LOGOUT, error: false }
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
    const path = "/api/records/v1/userrecords";
    const params = [FAKE_USER.id];
    await assertApiActionOnSuccess(
      path,
      api.onFetchUserProposals,
      params,
      [
        {
          type: act.REQUEST_USER_INVENTORY,
          error: false,
          payload: { userid: FAKE_USER.id }
        },
        { type: act.RECEIVE_USER_INVENTORY, error: false }
      ],
      {},
      methods.POST,
      {
        vetted: [],
        unvetted: []
      }
    );
    await assertApiActionOnError(
      path,
      api.onFetchUserProposals,
      params,
      (e) => [
        {
          type: act.REQUEST_USER_INVENTORY,
          error: false,
          payload: { userid: FAKE_USER.id }
        },
        { type: act.RECEIVE_USER_INVENTORY, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on fetch liked comments action", async () => {
    const path = "/api/comments/v1/votes";
    const params = [FAKE_PROPOSAL_TOKEN, FAKE_USER.id, PROPOSAL_STATE_VETTED];
    await assertApiActionOnSuccess(
      path,
      api.onFetchLikedComments,
      params,
      [
        { type: act.REQUEST_LIKED_COMMENTS },
        {
          type: act.RECEIVE_LIKED_COMMENTS,
          error: false,
          payload: { token: FAKE_PROPOSAL_TOKEN }
        }
      ],
      {},
      methods.POST
    );
    await assertApiActionOnError(
      path,
      api.onFetchLikedComments,
      params,
      (errorcode) => [
        {
          type: act.REQUEST_LIKED_COMMENTS,
          error: false,
          payload: FAKE_PROPOSAL_TOKEN
        },
        {
          type: act.RECEIVE_LIKED_COMMENTS,
          error: true,
          payload: { errorcode }
        }
      ],
      {},
      methods.POST
    );
  });

  test("on fetch proposal comments", async () => {
    const path = "/api/comments/v1/comments";
    const params = [FAKE_PROPOSAL_TOKEN];
    await assertApiActionOnSuccess(
      path,
      api.onFetchProposalComments,
      params,
      [
        { type: act.REQUEST_RECORD_COMMENTS },
        { type: act.RECEIVE_RECORD_COMMENTS, error: false }
      ],
      {},
      methods.POST
    );
    await assertApiActionOnError(
      path,
      api.onFetchProposalComments,
      params,
      (errorcode) => [
        {
          type: act.REQUEST_RECORD_COMMENTS,
          error: false,
          payload: FAKE_PROPOSAL_TOKEN
        },
        {
          type: act.RECEIVE_RECORD_COMMENTS,
          error: true,
          payload: { errorcode }
        }
      ],
      {},
      methods.POST
    );
  });

  test("on submit proposal", async () => {
    const path = "/api/records/v1/new";
    const params = [
      FAKE_USER.id,
      FAKE_USER.username,
      FAKE_PROPOSAL_NAME,
      FAKE_PROPOSAL_AMOUNT,
      FAKE_PROPOSAL_STARTDATE,
      FAKE_PROPOSAL_ENDDATE,
      FAKE_PROPOSAL_DOMAIN,
      FAKE_PROPOSAL_DESCRIPTION,
      FAKE_RFP_DEADLINE,
      FAKE_PROPOSAL_TYPE,
      FAKE_RFP_LINK,
      []
    ];

    const keys = await pki.generateKeys();
    await pki.loadKeys(FAKE_USER.id, keys);

    // this needs a custom assertion for success response as the common one
    // doesn't work for this case.
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
            rfpDeadline: FAKE_RFP_DEADLINE,
            type: FAKE_PROPOSAL_TYPE,
            rfpLink: FAKE_RFP_LINK,
            files: [],
            amount: FAKE_PROPOSAL_AMOUNT,
            startDate: FAKE_PROPOSAL_STARTDATE,
            endDate: FAKE_PROPOSAL_ENDDATE,
            domain: FAKE_PROPOSAL_DOMAIN
          }
        },
        { type: act.RECEIVE_NEW_PROPOSAL, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on submit comment action", async () => {
    const path = "/api/comments/v1/new";
    const parentId = 0;
    const params = [FAKE_USER.id, FAKE_PROPOSAL_TOKEN, FAKE_COMMENT, parentId];
    const keys = await pki.generateKeys(FAKE_USER.id);
    await pki.loadKeys(FAKE_USER.id, keys);

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
    const path = "/api/comments/v1/vote";
    const commentid = 0;
    const up_action = 1;
    //const down_action = -1;
    const params = [FAKE_USER.id, FAKE_PROPOSAL_TOKEN, commentid, up_action];

    // this needs a custom assertion for success response as the common one doesn't work for this case
    setPostSuccessResponse(path);
    const store = getMockedStore();
    await store.dispatch(api.onCommentVote.apply(null, params));
    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0].type).toEqual(act.REQUEST_LIKE_COMMENT);
    expect(dispatchedActions[1].type).toEqual(act.RECEIVE_LIKE_COMMENT);

    const keys = await pki.generateKeys(FAKE_USER.id);
    await pki.loadKeys(FAKE_USER.id, keys);

    await assertApiActionOnError(
      path,
      api.onCommentVote,
      params,
      (errorcode) => [
        {
          type: act.REQUEST_LIKE_COMMENT,
          error: false,
          payload: { commentid, token: FAKE_PROPOSAL_TOKEN }
        },
        {
          error: true,
          payload: { errorcode },
          type: act.RECEIVE_LIKE_COMMENT
        }
      ],
      {},
      methods.POST
    );
  });

  test("on update user key", async () => {
    const path = "/api/v1/user/key";
    const params = [FAKE_USER.ID];

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
    const params = [FAKE_USER.id, verificationtoken];

    const keys = await pki.generateKeys();
    await pki.loadKeys(FAKE_USER.id, keys);

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
      (errorcode) => [
        {
          type: act.REQUEST_VERIFIED_KEY,
          error: false,
          payload: { verificationtoken }
        },
        { type: act.RECEIVE_VERIFIED_KEY, error: true, payload: { errorcode } }
      ],
      {},
      methods.POST
    );
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
    const path = "/api/records/v1/edit";
    const params = [
      FAKE_USER.id,
      FAKE_PROPOSAL_NAME,
      // onSubmitEditedProposal accepts amount in USD and converts it to
      // cents.
      FAKE_PROPOSAL_AMOUNT / 100,
      FAKE_PROPOSAL_STARTDATE,
      FAKE_PROPOSAL_ENDDATE,
      FAKE_PROPOSAL_DOMAIN,
      FAKE_PROPOSAL_DESCRIPTION,
      FAKE_RFP_DEADLINE,
      FAKE_PROPOSAL_TYPE,
      FAKE_RFP_LINK,
      [],
      FAKE_PROPOSAL_TOKEN
    ];
    const keys = await pki.generateKeys(FAKE_USER.id);
    await pki.loadKeys(FAKE_USER.id, keys);

    // this needs a custom assertion for success response as the common one
    // doesn't work for this case.
    setPostSuccessResponse(
      path,
      {},
      {
        proposal: { censorshiprecord: { token: FAKE_PROPOSAL_TOKEN } }
      }
    );
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
            rfpDeadline: FAKE_RFP_DEADLINE,
            type: FAKE_PROPOSAL_TYPE,
            rfpLink: FAKE_RFP_LINK,
            files: [],
            amount: FAKE_PROPOSAL_AMOUNT,
            startDate: FAKE_PROPOSAL_STARTDATE,
            endDate: FAKE_PROPOSAL_ENDDATE,
            domain: FAKE_PROPOSAL_DOMAIN
          }
        },
        { type: act.RECEIVE_EDIT_PROPOSAL, error: true, payload: e }
      ],
      {},
      methods.POST
    );
  });

  test("on authorize vote on proposal action", async () => {
    const path = "/api/ticketvote/v1/authorize";
    const params = [FAKE_USER.id, FAKE_PROPOSAL_TOKEN, FAKE_PROPOSAL_VERSION];
    const requestAction = {
      type: act.REQUEST_AUTHORIZE_VOTE,
      error: false,
      payload: {
        token: FAKE_PROPOSAL_TOKEN
      }
    };
    const keys = await pki.generateKeys(FAKE_USER.id);
    await pki.loadKeys(FAKE_USER.id, keys);

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
    const path = "/api/v1/user/payments/paywalltx";

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
  test("on start vote", async () => {});
  test("on submit status proposal", () => {});
});
