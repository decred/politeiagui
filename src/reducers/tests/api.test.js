import cloneDeep from "lodash/cloneDeep";
import get from "lodash/fp/get";
import set from "lodash/set";
import * as act from "../../actions/types";
import {
  MANAGE_USER_CLEAR_USER_PAYWALL,
  MANAGE_USER_DEACTIVATE,
  MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
  MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  MANAGE_USER_REACTIVATE,
  MANAGE_USER_UNLOCK,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED
} from "../../constants";
import * as api from "../api";
import { DEFAULT_REQUEST_STATE, receive, request } from "../util";

const getUserFromState = (state) => state.user.response.user;

describe("test api reducer", () => {
  const MOCK_STATE = {
    commentslikes: {
      response: {
        commentslikes: [
          {
            action: "0",
            commentid: "1",
            token: "token_1"
          },
          {
            action: "0",
            commentid: "2",
            token: "token_1"
          }
        ]
      }
    },
    proposalComments: {
      response: {
        comments: [
          {
            token: "token_1",
            parentid: "0",
            comment: "This is a comment",
            signature: "sign",
            publickey: "pubkey",
            commentid: "1",
            receipt: "receipt",
            timestamp: 1532180179,
            totalvotes: 0,
            resultvotes: 0,
            userid: "0",
            username: "admin"
          },
          {
            token: "token_1",
            parentid: "0",
            comment: "This is a comment",
            signature: "sign",
            publickey: "pubkey",
            commentid: "2",
            receipt: "receipt",
            timestamp: 1532180179,
            totalvotes: 0,
            resultvotes: 0,
            userid: "0",
            username: "admin"
          }
        ]
      }
    },
    me: {
      response: {
        username: "admin",
        isadmin: true
      }
    },
    proposal: {
      response: {
        proposal: {
          censorshiprecord: {
            token: "censortoken"
          },
          files: [],
          username: ""
        }
      }
    },
    unvetted: {
      response: {
        proposals: [
          {
            censorshiprecord: {
              token: "censortoken"
            }
          },
          {
            censorshiprecord: {
              token: "anothertoken"
            }
          }
        ]
      }
    },
    user: {
      response: {
        user: {
          proposalcredits: 3
        }
      }
    },
    vetted: DEFAULT_REQUEST_STATE,
    userProposals: DEFAULT_REQUEST_STATE,
    proposalsVoteStatus: DEFAULT_REQUEST_STATE,
    manageUser: DEFAULT_REQUEST_STATE
  };

  const MOCK_PROPOSALS_LOAD = [
    {
      censorshiprecord: {
        token: "censortoken"
      },
      status: PROPOSAL_STATUS_UNREVIEWED
    },
    {
      censorshiprecord: {
        token: "randomtoken"
      },
      status: PROPOSAL_STATUS_UNREVIEWED
    },
    {
      censorshiprecord: {
        token: "randomtoken2"
      },
      status: PROPOSAL_STATUS_PUBLIC
    }
  ];

  const getCommentVoteFromState = (state, token, commentid) =>
    state.commentslikes.response.commentslikes.filter(
      (cv) => cv.token === token && cv.commentid === commentid
    )[0];
  const getProposalCommentFromState = (state, token, commentid) =>
    state.proposalComments.response.comments.filter(
      (c) => c.token === token && c.commentid === commentid
    )[0];

  const assertStateAfterCommentVote = (
    state,
    actionPayload,
    expAction,
    expTotal,
    expResult
  ) => {
    const { token, commentid } = actionPayload;
    const initialState = cloneDeep(state);

    const newState = api.onReceiveSyncLikeComment(state, {
      payload: actionPayload
    });
    const newCommentVote = getCommentVoteFromState(newState, token, commentid);
    const newComment = getProposalCommentFromState(newState, token, commentid);
    expect(newCommentVote).toEqual({ token, commentid, action: expAction });
    expect(newComment.totalvotes).toEqual(expTotal);
    expect(newComment.resultvotes).toEqual(expResult);
    expect(newState.commentslikes.backup).toEqual(
      initialState.commentslikes.response.commentslikes
    );
    expect(newState.proposalComments.backup).toEqual(
      initialState.proposalComments.response.comments
    );

    const reducerState = api.default(state, {
      type: act.RECEIVE_SYNC_LIKE_COMMENT,
      payload: actionPayload
    });
    const newCommentVoteR = getCommentVoteFromState(
      reducerState,
      token,
      commentid
    );
    const newCommentR = getProposalCommentFromState(
      reducerState,
      token,
      commentid
    );
    expect(newCommentVoteR).toEqual({ token, commentid, action: expAction });
    expect(newCommentR.totalvotes).toEqual(expTotal);
    expect(newCommentR.resultvotes).toEqual(expResult);
    expect(reducerState.commentslikes.backup).toEqual(
      initialState.commentslikes.response.commentslikes
    );
    expect(reducerState.proposalComments.backup).toEqual(
      initialState.proposalComments.response.comments
    );

    return newState;
  };

  const addNewCommentToState = (state, action) => {
    return receive(
      "newComment",
      {
        ...state,
        vetted: {
          ...state.vetted,
          response: {
            ...state.vetted.response,
            proposals: []
          }
        },
        proposalComments: {
          ...state.proposalComments,
          response: {
            ...state.proposalComments.response,
            comments: [
              ...state.proposalComments.response.comments,
              {
                ...state.newComment.payload,
                token: state.proposal.payload,
                userid: "1",
                username: state.me.response.username,
                isadmin: state.me.response.isadmin,
                totalvotes: 0,
                resultvotes: 0,
                commentid: "3"
              }
            ]
          }
        }
      },
      action
    );
  };

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
      newDCC: DEFAULT_REQUEST_STATE,
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

  test("correctly updates the state for onReceiveSyncLikeComment", () => {
    const token = "token_1";
    const commentid = "1";
    const actionPayload = { token, commentid };
    const initialState = cloneDeep(MOCK_STATE);

    actionPayload.action = 1;
    let state = {
      ...assertStateAfterCommentVote(initialState, actionPayload, 1, 1, 1)
    };

    // note: stateAux is being used only to bypass eslint
    actionPayload.action = 1;
    const stateAux = assertStateAfterCommentVote(state, actionPayload, 0, 0, 0);

    actionPayload.action = 1;
    state = assertStateAfterCommentVote(stateAux, actionPayload, 1, 1, 1);

    actionPayload.action = -1;
    state = assertStateAfterCommentVote(state, actionPayload, -1, 1, -1);

    actionPayload.action = -1;
    state = assertStateAfterCommentVote(state, actionPayload, 0, 0, 0);

    actionPayload.action = -1;
    state = assertStateAfterCommentVote(state, actionPayload, -1, 1, -1);

    actionPayload.action = 1;
    state = assertStateAfterCommentVote(state, actionPayload, 1, 1, 1);

    actionPayload.commentid = "2";
    actionPayload.action = 1;
    state = assertStateAfterCommentVote(state, actionPayload, 1, 1, 1);
  });

  test("correctly reset the state for onResetSyncLikeComment", () => {
    const token = "token_1";
    const commentid = "1";
    const actionPayload = { token, commentid };
    const initialState = cloneDeep(MOCK_STATE);

    actionPayload.action = 1;
    const state = assertStateAfterCommentVote(
      MOCK_STATE,
      actionPayload,
      1,
      1,
      1
    );
    const stateAfterReset = api.onResetSyncLikeComment(state);
    const stateAfterResetR = api.default(state, {
      type: act.RESET_SYNC_LIKE_COMMENT
    });
    expect(stateAfterReset.commentslikes.response.commentslikes).toEqual(
      initialState.commentslikes.response.commentslikes
    );
    expect(stateAfterReset.proposalComments.response.comments).toEqual(
      initialState.proposalComments.response.comments
    );
    expect(stateAfterResetR.commentslikes.response.commentslikes).toEqual(
      initialState.commentslikes.response.commentslikes
    );
    expect(stateAfterResetR.proposalComments.response.comments).toEqual(
      initialState.proposalComments.response.comments
    );
  });

  test("correctly updates state for onReceiveNewComment, adds new comment and update vetted", () => {
    const action = {
      type: act.RECEIVE_NEW_COMMENT,
      payload: {
        userid: "1",
        commentid: "3"
      },
      error: false
    };

    let state = {
      ...MOCK_STATE,
      newComment: {
        payload: {
          parentid: "0",
          comment: "This is a new comment",
          signature: "sign",
          publickey: "pubkey",
          receipt: "receipt"
        }
      }
    };

    let newState = api.onReceiveNewComment(state, action);
    let expectedState = addNewCommentToState(state, action);
    for (
      let i = 0;
      i < newState.proposalComments.response.comments.length;
      i++
    ) {
      if (newState.proposalComments.response.comments[i])
        delete newState.proposalComments.response.comments[i].timestamp;
    }
    expect(expectedState).toEqual(newState);

    const reducerState = api.default(state, action);
    for (
      let i = 0;
      i < reducerState.proposalComments.response.comments.length;
      i++
    ) {
      if (reducerState.proposalComments.response.comments[i])
        delete reducerState.proposalComments.response.comments[i].timestamp;
    }
    expect(expectedState).toEqual(reducerState);

    state = {
      ...expectedState,
      newComment: {
        payload: {
          parentid: "0",
          comment: "This is another new comment",
          signature: "sign",
          publickey: "pubkey",
          receipt: "receipt"
        }
      }
    };

    newState = api.onReceiveNewComment(state, action);
    expectedState = addNewCommentToState(state, action);
    for (
      let i = 0;
      i < newState.proposalComments.response.comments.length;
      i++
    ) {
      if (newState.proposalComments.response.comments[i])
        delete newState.proposalComments.response.comments[i].timestamp;
    }
    expect(expectedState).toEqual(newState);

    const action2 = {
      payload: "",
      error: true
    };

    expect(api.onReceiveNewComment({}, action2)).toEqual(
      receive("newComment", {}, action2)
    );
  });

  test("correctly updates status state for onReceiveSetStatus (unvetted -> vetted)", () => {
    const proposalUpdated = {
      ...MOCK_STATE.unvetted.response.proposals[0],
      status: 4,
      files: [],
      username: ""
    };

    const action = {
      type: act.RECEIVE_SETSTATUS_PROPOSAL,
      payload: {
        proposal: proposalUpdated
      },
      error: false
    };

    let state = request("setStatusProposal", MOCK_STATE, action);
    state = api.onReceiveSetStatus(state, action);

    expect(api.default(state, action).proposal.response.proposal).toEqual(
      proposalUpdated
    );

    // updates status to 'vetted' for the proposal with token 'censortoken'
    expect(state.proposal.response.proposal).toEqual(proposalUpdated);

    // make sure the proposal was removed from the unvetted list
    expect(state.unvetted.response.proposals).toEqual(
      MOCK_STATE.unvetted.response.proposals.filter((_, i) => i !== 0)
    );

    // make sure the proposal was added to the vetted list
    expect(state.vetted.response.proposals).toEqual([proposalUpdated]);
  });

  test("correcly updates status state for onReceiveSetStatus (unvetted -> censored)", () => {
    const proposalUpdated = {
      ...MOCK_STATE.unvetted.response.proposals[0],
      status: 3,
      files: [],
      username: ""
    };

    const action = {
      type: act.RECEIVE_SETSTATUS_PROPOSAL,
      payload: {
        proposal: proposalUpdated
      },
      error: false
    };

    let state = request("setStatusProposal", MOCK_STATE, action);
    state = api.onReceiveSetStatus(state, action);

    expect(api.default(state, action).proposal.response.proposal).toEqual(
      proposalUpdated
    );

    // updates status to 'censored' for the proposal with token 'censortoken'
    expect(state.proposal.response.proposal).toEqual(proposalUpdated);

    // make sure the proposal was updated and kept in the unvetted list
    expect(state.unvetted.response.proposals[0]).toEqual(proposalUpdated);

    // make sure vetted list is still the same
    expect(state.vetted.response.proposals).toEqual([]);
  });

  test("correctly updates the state for onReceiveProposals", () => {
    const key = "userProposals";

    const action = {
      type: act.RECEIVE_USER_PROPOSALS,
      payload: {
        proposals: MOCK_PROPOSALS_LOAD
      }
    };
    const state = api.onReceiveProposals(key, MOCK_STATE, action);

    // check if the unvetted proposals were correctly updated
    const { proposals: unvettedResult } = state.unvetted.response;
    expect(unvettedResult.length).toEqual(3);
    expect(unvettedResult[0].censorshiprecord.token).toEqual("censortoken");

    // check if the vetted proposals were correctly updated
    const { proposals: vettedResult } = state.vetted.response;
    expect(vettedResult.length).toEqual(1);
    expect(vettedResult[0].censorshiprecord.token).toEqual("randomtoken2");
  });

  test("correctly updates the state for onReceiveUser", () => {
    const action = {
      type: act.RECEIVE_USER,
      payload: {
        user: {
          proposals: MOCK_PROPOSALS_LOAD
        }
      }
    };

    const state = api.onReceiveUser(MOCK_STATE, action);

    // check if the unvetted proposals were correctly updated
    const { proposals: unvettedResult } = state.unvetted.response;
    expect(unvettedResult.length).toEqual(3);
    expect(unvettedResult[0].censorshiprecord.token).toEqual("censortoken");

    // check if the vetted proposals were correctly updated
    const { proposals: vettedResult } = state.vetted.response;
    expect(vettedResult.length).toEqual(1);
    expect(vettedResult[0].censorshiprecord.token).toEqual("randomtoken2");
  });

  test("correctly updates the state for for onReceiveRescanUserPayments", () => {
    const action = {
      type: act.RECEIVE_RESCAN_USER_PAYMENTS,
      payload: {
        newcredits: [{ paywallid: 1 }, { paywallid: 2 }]
      }
    };

    const state = api.onReceiveRescanUserPayments(MOCK_STATE, action);

    // make sure the user credits are updated
    const { user } = state.user.response;
    expect(user.proposalcredits).toEqual(
      getUserFromState(MOCK_STATE).proposalcredits + 2
    );

    // make sure the state has received the entire response from the request
    expect(state.rescanUserPayments.response.newcredits).toBeTruthy();
  });

  test("correctly updates the state for onReceiveManageUser", () => {
    const getUserFromState = (state) =>
      get(["user", "response", "user"], state);
    const updateStateForManageUser = (state, manageUserAction) => {
      // simulate the update of state for 'REQUEST_MANAGE_USER'
      const stateAfterRequest = set(state, ["manageUser", "payload"], {
        action: manageUserAction
      });

      const action = {
        type: act.RECEIVE_MANAGE_USER,
        payload: {}
      };

      return api.onReceiveManageUser(stateAfterRequest, action);
    };
    let resultState = null;
    let user = null;

    resultState = updateStateForManageUser(
      MOCK_STATE,
      MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION
    );
    user = getUserFromState(resultState);
    expect(user.updatekeyverificationexpiry).toBeTruthy();
    expect(user.updatekeyverificationexpiry * 1000).toBeLessThan(
      new Date().getTime()
    );

    resultState = updateStateForManageUser(
      MOCK_STATE,
      MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION
    );
    user = getUserFromState(resultState);
    expect(user.newuserverificationexpiry).toBeTruthy();
    expect(user.newuserverificationexpiry * 1000).toBeLessThan(
      new Date().getTime()
    );

    resultState = updateStateForManageUser(
      MOCK_STATE,
      MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION
    );
    user = getUserFromState(resultState);
    expect(user.resetpasswordverificationexpiry).toBeTruthy();
    expect(user.resetpasswordverificationexpiry * 1000).toBeLessThan(
      new Date().getTime()
    );

    // test state after clearing user paywall
    resultState = updateStateForManageUser(
      MOCK_STATE,
      MANAGE_USER_CLEAR_USER_PAYWALL
    );
    user = getUserFromState(resultState);
    expect(user.newuserpaywallamount).toEqual(0);

    // test state after unlocking user
    resultState = updateStateForManageUser(MOCK_STATE, MANAGE_USER_UNLOCK);
    user = getUserFromState(resultState);
    expect(user.islocked).toEqual(false);

    // test state after deactivating user
    resultState = updateStateForManageUser(MOCK_STATE, MANAGE_USER_DEACTIVATE);
    user = getUserFromState(resultState);
    expect(user.isdeactivated).toEqual(true);

    // test state after reactivating user
    resultState = updateStateForManageUser(MOCK_STATE, MANAGE_USER_REACTIVATE);
    user = getUserFromState(resultState);
    expect(user.isdeactivated).toEqual(false);
  });
});
