import * as api from "../api";
import * as act from "../../actions/types";
import cloneDeep from "lodash/cloneDeep";
import { DEFAULT_REQUEST_STATE } from "../util";
import { PROPOSAL_VOTING_ACTIVE } from "../../constants";
import { request, receive } from "../util";
import { testReceiveReducer, testRequestReducer, testResetReducer, testResetMultipleReducer } from "./helpers";

describe("test api reducer", () => {
  const MOCK_STATE = {
    commentsvotes: {
      response: {
        commentsvotes: [
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
          }
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
    }
  };

  const getCommentVoteFromState = (state, token, commentid) =>
    state.commentsvotes.response.commentsvotes.filter(cv => cv.token === token && cv.commentid === commentid)[0];
  const getProposalCommentFromState = (state, token, commentid) =>
    state.proposalComments.response.comments.filter(c => c.token === token && c.commentid === commentid)[0];

  const assertStateAfterCommentVote = (state, actionPayload, expAction, expTotal, expResult) => {
    const { token, commentid } = actionPayload;
    const initialState = cloneDeep(state);

    const newState = api.onReceiveSyncLikeComment(state, { payload: actionPayload });
    const newCommentVote = getCommentVoteFromState(newState, token, commentid);
    const newComment = getProposalCommentFromState(newState, token, commentid);
    expect(newCommentVote).toEqual({ token, commentid, action: expAction });
    expect(newComment.totalvotes).toEqual(expTotal);
    expect(newComment.resultvotes).toEqual(expResult);
    expect(newState.commentsvotes.backup).toEqual(initialState.commentsvotes.response.commentsvotes);
    expect(newState.proposalComments.backup).toEqual(initialState.proposalComments.response.comments);

    const reducerState = api.default(state, { type: act.RECEIVE_SYNC_LIKE_COMMENT, payload: actionPayload });
    const newCommentVoteR = getCommentVoteFromState(reducerState, token, commentid);
    const newCommentR = getProposalCommentFromState(reducerState, token, commentid);
    expect(newCommentVoteR).toEqual({ token, commentid, action: expAction });
    expect(newCommentR.totalvotes).toEqual(expTotal);
    expect(newCommentR.resultvotes).toEqual(expResult);
    expect(reducerState.commentsvotes.backup).toEqual(initialState.commentsvotes.response.commentsvotes);
    expect(reducerState.proposalComments.backup).toEqual(initialState.proposalComments.response.comments);

    return newState;
  };

  const addNewCommentToState = (state, action) => {
    return (receive("newComment", {
      ...state,
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
    }, action));
  };

  test("default tests for api reducer", () => {
    expect(api.DEFAULT_STATE).toEqual({
      me: DEFAULT_REQUEST_STATE,
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
      proposalComments: DEFAULT_REQUEST_STATE,
      proposalsVoteStatus: DEFAULT_REQUEST_STATE,
      proposalVoteStatus: DEFAULT_REQUEST_STATE,
      commentsvotes: DEFAULT_REQUEST_STATE,
      userProposals: DEFAULT_REQUEST_STATE,
      newProposal: DEFAULT_REQUEST_STATE,
      editProposal: DEFAULT_REQUEST_STATE,
      newComment: DEFAULT_REQUEST_STATE,
      forgottenPassword: DEFAULT_REQUEST_STATE,
      passwordReset: DEFAULT_REQUEST_STATE,
      changeUsername: DEFAULT_REQUEST_STATE,
      changePassword: DEFAULT_REQUEST_STATE,
      updateUserKey: DEFAULT_REQUEST_STATE,
      verifyUserKey: DEFAULT_REQUEST_STATE,
      likeComment: DEFAULT_REQUEST_STATE,
      email: "",
      keyMismatch: false
    });

    expect(api.default(undefined, { type: "" })).toEqual(api.DEFAULT_STATE);

    // logout action
    let action = {
      type: act.RECEIVE_LOGOUT
    };

    expect(api.default(undefined, action)).toEqual(api.DEFAULT_STATE);

    // redirect from action
    action = {
      type: act.REDIRECTED_FROM,
      payload: "account page"
    };

    expect(api.default({}, action)).toEqual({
      login: { redirectedFrom: action.payload }
    });

    // key mismatch action
    action = {
      type: act.KEY_MISMATCH,
      payload: "warning msg"
    };

    expect(api.default({}, action)).toEqual({ keyMismatch: action.payload });

    // load me action
    action = {
      type: act.LOAD_ME,
      payload: "me data"
    };

    expect(api.default({}, action)).toEqual({ me: action.payload });

    // set email action
    action = {
      type: act.SET_EMAIL,
      payload: "any@any.com"
    };

    expect(api.default({}, action)).toEqual({ email: action.payload });

    // clean errors action
    action = {
      type: act.CLEAN_ERRORS
    };

    const state = {
      me: {
        error: true
      },
      api: {
        error: true
      },
      app: "test"
    };

    expect(api.default(state, action)).toEqual({
      me: {
        error: null
      },
      api: {
        error: null
      },
      app: "test"
    });
  });

  test("correctly updates the state for onReceiveSyncLikeComment", () => {
    const token = "token_1";
    const commentid = "1";
    const actionPayload = { token, commentid };
    const initialState = cloneDeep(MOCK_STATE);

    actionPayload.action = 1;
    let state = { ...assertStateAfterCommentVote(initialState, actionPayload, 1, 1, 1) };

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
    const state = assertStateAfterCommentVote(MOCK_STATE, actionPayload, 1, 1, 1);
    const stateAfterReset = api.onResetSyncLikeComment(state);
    const stateAfterResetR = api.default(state, { type: act.RESET_SYNC_LIKE_COMMENT });
    expect(stateAfterReset.commentsvotes.response.commentsvotes).toEqual(initialState.commentsvotes.response.commentsvotes);
    expect(stateAfterReset.proposalComments.response.comments).toEqual(initialState.proposalComments.response.comments);
    expect(stateAfterResetR.commentsvotes.response.commentsvotes).toEqual(initialState.commentsvotes.response.commentsvotes);
    expect(stateAfterResetR.proposalComments.response.comments).toEqual(initialState.proposalComments.response.comments);
  });

  test("correctly updates state for onReceiveNewComment, adds new comment and nothing else", () => {

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
    for (let i = 0; i < newState.proposalComments.response.comments.length; i++) {
      if (newState.proposalComments.response.comments[i])
        delete newState.proposalComments.response.comments[i].timestamp;
    }
    expect(expectedState).toEqual(newState);

    const reducerState = api.default(state, action);
    for (let i = 0; i < reducerState.proposalComments.response.comments.length; i++) {
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
    for (let i = 0; i < newState.proposalComments.response.comments.length; i++) {
      if (newState.proposalComments.response.comments[i])
        delete newState.proposalComments.response.comments[i].timestamp;
    }
    expect(expectedState).toEqual(newState);

    const action2 = {
      payload: "",
      error: true
    };

    expect(api.onReceiveNewComment({}, action2)).toEqual(receive("newComment", {}, action2));
  });

  test("correcly updates status state for onReceiveSetStatus", () => {
    const proposalUpdated = {
      censorshiprecord: {
        token: "censortoken"
      },
      status: 3
    };

    let action = {
      type: act.RECEIVE_SETSTATUS_PROPOSAL,
      payload: {
        proposal: proposalUpdated
      },
      error: false
    };

    let state = request("setStatusProposal", MOCK_STATE, action);
    let newState = api.onReceiveSetStatus(state, action);

    expect(api.default(state, action).proposal.response.proposal)
      .toEqual(proposalUpdated);

    // updates status to 'vetted' for the proposal with token 'censortoken'
    expect(newState.proposal.response.proposal).toEqual(proposalUpdated);

    expect(newState.unvetted.response.proposals).toEqual([
      proposalUpdated,
      {
        censorshiprecord: {
          token: "anothertoken"
        }
      }
    ]);
    action = {
      ...action,
      payload: {
        token: "misctoken"
      }
    };

    state = request("setStatusProposal", MOCK_STATE, action);
    newState = api.onReceiveSetStatus(state, action);

    // doesn't update any proposal status
    expect(newState.unvetted.response.proposals).toEqual(MOCK_STATE.unvetted.response.proposals);
  });

  test("correcly updates state for onReceiveStartVote", () => {
    const action = {
      type: act.RECEIVE_START_VOTE,
      payload: {
        token: "token"
      },
      error: false
    };

    const newVoteStatus = {
      token: action.payload.token,
      status: PROPOSAL_VOTING_ACTIVE,
      optionsresult: null,
      totalvotes: 0
    };

    const state = request("startVote", MOCK_STATE, action);

    const stateWithoutVotes = {
      ...state,
      proposalsVoteStatus: {
        response: {
          votesstatus: null
        }
      },
      proposalVoteStatus: {
        response: {
          newVoteStatus: null
        }
      }
    };

    const stateWithVotes = {
      ...state,
      proposalsVoteStatus: {
        response: {
          votesstatus: [
            { token: "anothertoken" },
            { token: action.payload.token }
          ]
        }
      },
      proposalVoteStatus: {
        response: {
          newVoteStatus: newVoteStatus
        }
      }
    };

    let newState = api.onReceiveStartVote(stateWithoutVotes, action);
    expect(newState.proposalsVoteStatus.response.votesstatus[0]).toEqual(newVoteStatus);
    const reducerState = api.default(stateWithVotes, action);
    expect(reducerState.proposalsVoteStatus.response.votesstatus).toEqual([
      { token: "anothertoken" },
      newVoteStatus
    ]);
    newState = api.onReceiveStartVote(stateWithVotes, action);
    expect(newState.proposalsVoteStatus.response.votesstatus).toEqual([
      { token: "anothertoken" },
      newVoteStatus
    ]);
  });

  test("correctly updates state for reducers using request/receive/reset", () => {

    const reducers = [
      { action: act.REQUEST_ME, key: "me", type: "request" },
      { action: act.RECEIVE_ME, key: "me", type: "receive" },
      { action: act.UPDATE_ME, key: "me", type: "receive" },
      { action: act.REQUEST_INIT_SESSION, key: "init", type: "request" },
      { action: act.RECEIVE_INIT_SESSION, key: "init", type: "receive" },
      { action: act.REQUEST_POLICY, key: "policy", type: "request" },
      { action: act.RECEIVE_POLICY, key: "policy", type: "receive" },
      { action: act.REQUEST_NEW_USER, key: "newUser", type: "request" },
      { action: act.RECEIVE_NEW_USER, key: "newUser", type: "receive" },
      { action: act.RESET_NEW_USER, key: "newUser", type: "reset" },
      { action: act.REQUEST_VERIFY_NEW_USER, key: "verifyNewUser", type: "request" },
      { action: act.RECEIVE_VERIFY_NEW_USER, key: "verifyNewUser", type: "receive" },
      { action: act.REQUEST_USER, key: "user", type: "request" },
      { action: act.RECEIVE_USER, key: "user", type: "receive" },
      { action: act.REQUEST_LOGIN, key: "login", type: "request" },
      { action: act.RECEIVE_LOGIN, key: "login", type: "receive" },
      { action: act.REQUEST_CHANGE_USERNAME, key: "changeUsername", type: "request" },
      { action: act.RECEIVE_CHANGE_USERNAME, key: "changeUsername", type: "receive" },
      { action: act.REQUEST_CHANGE_PASSWORD, key: "changePassword", type: "request" },
      { action: act.RECEIVE_CHANGE_PASSWORD, key: "changePassword", type: "receive" },
      { action: act.REQUEST_USER_PROPOSALS, key: "userProposals", type: "request" },
      { action: act.RECEIVE_USER_PROPOSALS, key: "userProposals", type: "receive" },
      { action: act.REQUEST_VETTED, key: "vetted", type: "request" },
      { action: act.RECEIVE_VETTED, key: "vetted", type: "receive" },
      { action: act.REQUEST_UNVETTED, key: "unvetted", type: "request" },
      { action: act.RECEIVE_UNVETTED, key: "unvetted", type: "receive" },
      { action: act.REQUEST_PROPOSAL, key: "proposal", type: "request" },
      { action: act.RECEIVE_PROPOSAL, key: "proposal", type: "receive" },
      { action: act.REQUEST_PROPOSAL_COMMENTS, key: "proposalComments", type: "request" },
      { action: act.RECEIVE_PROPOSAL_COMMENTS, key: "proposalComments", type: "receive" },
      { action: act.REQUEST_LIKE_COMMENT, key: "likeComment", type: "request" },
      { action: act.RECEIVE_LIKE_COMMENT, key: "likeComment", type: "receive" },
      { action: act.REQUEST_LIKED_COMMENTS, key: "commentsvotes", type: "request" },
      { action: act.RECEIVE_LIKED_COMMENTS, key: "commentsvotes", type: "receive" },
      { action: act.REQUEST_EDIT_USER, key: "editUser", type: "request" },
      { action: act.RECEIVE_EDIT_USER, key: "editUser", type: "receive" },
      { action: act.REQUEST_NEW_PROPOSAL, key: "newProposal", type: "request" },
      { action: act.RECEIVE_NEW_PROPOSAL, key: "newProposal", type: "receive" },
      { action: act.REQUEST_EDIT_PROPOSAL, key: "editProposal", type: "request" },
      { action: act.RECEIVE_EDIT_PROPOSAL, key: "editProposal", type: "receive" },
      { action: act.REQUEST_NEW_COMMENT, key: "newComment", type: "request" },
      { action: act.REQUEST_PROPOSAL_PAYWALL_DETAILS, key: "proposalPaywallDetails", type: "request" },
      { action: act.RECEIVE_PROPOSAL_PAYWALL_DETAILS, key: "proposalPaywallDetails", type: "receive" },
      { action: act.REQUEST_UPDATE_PROPOSAL_CREDITS, key: "updateProposalCredits", type: "request" },
      { action: act.RECEIVE_UPDATE_PROPOSAL_CREDITS, key: "updateProposalCredits", type: "receive" },
      { action: act.REQUEST_USER_PROPOSAL_CREDITS, key: "userProposalCredits", type: "request" },
      { action: act.RECEIVE_USER_PROPOSAL_CREDITS, key: "userProposalCredits", type: "receive" },
      { action: act.REQUEST_FORGOTTEN_PASSWORD_REQUEST, key: "forgottenPassword", type: "request" },
      { action: act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST, key: "forgottenPassword", type: "receive" },
      { action: act.RESET_FORGOTTEN_PASSWORD_REQUEST, key: "forgottenPassword", type: "reset" },
      { action: act.REQUEST_RESEND_VERIFICATION_EMAIL, key: "resendVerificationEmail", type: "request" },
      { action: act.RECEIVE_RESEND_VERIFICATION_EMAIL, key: "resendVerificationEmail", type: "receive" },
      { action: act.RESET_RESEND_VERIFICATION_EMAIL, key: "resendVerificationEmail", type: "reset" },
      { action: act.REQUEST_PASSWORD_RESET_REQUEST, key: "passwordReset", type: "request" },
      { action: act.RECEIVE_PASSWORD_RESET_REQUEST, key: "passwordReset", type: "receive" },
      { action: act.RESET_PROPOSAL, key: [ "newProposal", "editProposal" ], type: "resetMultiple" },
      { action: act.RESET_REDIRECTED_FROM, key: "login", type: "reset" },
      { action: act.REQUEST_SETSTATUS_PROPOSAL, key: "setStatusProposal", type: "request" },
      { action: act.REQUEST_START_VOTE, key: "startVote", type: "request" },
      { action: act.REQUEST_UPDATED_KEY, key: "updateUserKey", type: "request" },
      { action: act.RECEIVE_UPDATED_KEY, key: "updateUserKey", type: "receive" },
      { action: act.REQUEST_VERIFIED_KEY, key: "verifyUserKey", type: "request" },
      { action: act.RECEIVE_VERIFIED_KEY, key: "verifyUserKey", type: "receive" },
      { action: act.REQUEST_USERNAMES_BY_ID, key: "usernamesById", type: "request" },
      { action: act.RECEIVE_USERNAMES_BY_ID, key: "usernamesById", type: "receive" },
      { action: act.REQUEST_LOGOUT, key: "logout", type: "request" },
      { action: act.REQUEST_PROPOSALS_VOTE_STATUS, key: "proposalsVoteStatus", type: "request" },
      { action: act.RECEIVE_PROPOSALS_VOTE_STATUS, key: "proposalsVoteStatus", type: "receive" },
      { action: act.REQUEST_PROPOSAL_VOTE_STATUS, key: "proposalVoteStatus", type: "request" },
      { action: act.RECEIVE_PROPOSAL_VOTE_STATUS, key: "proposalVoteStatus", type: "receive" }
    ];

    reducers.map(({ action, key, type }) => {
      const MOCK_ACTION = {
        type: action,
        payload: "data",
        error: false
      };

      switch (type) {
      case "request":
        testRequestReducer(api.default, key, {}, MOCK_ACTION);
        break;
      case "receive":
        testReceiveReducer(api.default, key, {}, MOCK_ACTION);
        break;
      case "reset":
        testResetReducer(api.default, key, {}, MOCK_ACTION);
        break;
      case "resetMultiple":
        testResetMultipleReducer(api.default, key, {}, MOCK_ACTION);
        break;
      default:
        break;
      }
    });
  });

});
