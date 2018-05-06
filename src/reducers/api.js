import * as act from "../actions/types";
import get from "lodash/fp/get";
import map from "lodash/fp/map";
import { DEFAULT_REQUEST_STATE, request, receive, reset } from "./util";

export const DEFAULT_STATE = {
  me: DEFAULT_REQUEST_STATE,
  init: DEFAULT_REQUEST_STATE,
  policy: DEFAULT_REQUEST_STATE,
  newUser: DEFAULT_REQUEST_STATE,
  verifyNewUser: DEFAULT_REQUEST_STATE,
  login: DEFAULT_REQUEST_STATE,
  logout: DEFAULT_REQUEST_STATE,
  vetted: DEFAULT_REQUEST_STATE,
  unvetted: DEFAULT_REQUEST_STATE,
  proposal: DEFAULT_REQUEST_STATE,
  proposalComments: DEFAULT_REQUEST_STATE,
  userProposals: DEFAULT_REQUEST_STATE,
  newProposal: DEFAULT_REQUEST_STATE,
  newComment: DEFAULT_REQUEST_STATE,
  forgottenPassword: DEFAULT_REQUEST_STATE,
  passwordReset: DEFAULT_REQUEST_STATE,
  updateUserKey: DEFAULT_REQUEST_STATE,
  verifyUserKey: DEFAULT_REQUEST_STATE,
  email: "",
  keyMismatch: false,
};

const onReceiveSetStatus = (state, action) => {
  state = receive("setStatusProposal", state, action);
  if (action.error) return state;

  const token = get(["setStatusProposal", "payload", "token"], state);
  const status = get(["setStatusProposal", "payload", "status"], state);
  const viewedProposal = get(["proposal", "response", "proposal"], state);
  const updateProposalStatus = proposal => {
    if (token === get(["censorshiprecord", "token"], proposal)) {
      return { ...proposal, status };
    } else {
      return proposal;
    }
  };
  const updatedViewed = viewedProposal && updateProposalStatus(viewedProposal);

  console.log("onReceiveSetStatus", { state, action, token, status });

  return {
    ...state,
    proposal: (viewedProposal && viewedProposal !== updatedViewed)
      ? ({
        ...state.proposal,
        response: {
          ...state.proposal.response,
          proposal: updateProposalStatus(viewedProposal)
        }
      }) : state.proposal,
    unvetted: {
      ...state.unvetted,
      response: {
        ...state.unvetted.response,
        proposals: map(
          updateProposalStatus,
          (get(["unvetted", "response", "proposals"], state) || [])
        )
      }
    }
  };
};

const onReceiveNewComment = (state, action) => {
  state = receive("newComment", state, action);
  if (action.error) return state;
  return {
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
            userid: "me",
            commentid: state.newComment.response.commentid,
            timestamp: Date.now() / 1000
          }
        ]
      }
    }
  };
};

const api = (state = DEFAULT_STATE, action) => (({
  [act.SET_EMAIL]: () => ({ ...state, email: action.payload }),
  [act.CLEAN_ERRORS]: () => (
    Object.keys(state).reduce((acc, curr) => {
      if (typeof state[curr] === "object") {
        acc[curr] = Object.assign({}, state[curr], { error: null });
      }
      else {
        acc[curr] = state[curr];
      }
      return acc;
    }, {})
  ),
  [act.LOAD_ME]: () => {
    return ({
      ...state,
      me: action.payload
    });
  },
  [act.REQUEST_ME]: () => request("me", state, action),
  [act.RECEIVE_ME]: () => receive("me", state, action),
  [act.UPDATE_ME]: () => receive("me", state, action),
  [act.REQUEST_INIT_SESSION]: () => request("init", state, action),
  [act.RECEIVE_INIT_SESSION]: () => receive("init", state, action),
  [act.REQUEST_POLICY]: () => request("policy", state, action),
  [act.RECEIVE_POLICY]: () => receive("policy", state, action),
  [act.REQUEST_NEW_USER]: () => request("newUser", state, action),
  [act.RECEIVE_NEW_USER]: () => receive("newUser", state, action),
  [act.RESET_NEW_USER]: () => reset("newUser", state),
  [act.REQUEST_VERIFY_NEW_USER]: () => request("verifyNewUser", state, action),
  [act.RECEIVE_VERIFY_NEW_USER]: () => receive("verifyNewUser", state, action),
  [act.REQUEST_LOGIN]: () => request("login", state, action),
  [act.RECEIVE_LOGIN]: () => receive("login", state, action),
  [act.REQUEST_CHANGE_PASSWORD]: () => request("changePassword", state, action),
  [act.RECEIVE_CHANGE_PASSWORD]: () => receive("changePassword", state, action),
  [act.REQUEST_USER_PROPOSALS]: () => request("userProposals", state, action),
  [act.RECEIVE_USER_PROPOSALS]: () => receive("userProposals", state, action),
  [act.REQUEST_VETTED]: () => request("vetted", state, action),
  [act.RECEIVE_VETTED]: () => receive("vetted", state, action),
  [act.REQUEST_UNVETTED]: () => request("unvetted", state, action),
  [act.RECEIVE_UNVETTED]: () => receive("unvetted", state, action),
  [act.REQUEST_PROPOSAL]: () => request("proposal", state, action),
  [act.RECEIVE_PROPOSAL]: () => receive("proposal", state, action),
  [act.REQUEST_PROPOSAL_COMMENTS]: () => request("proposalComments", state, action),
  [act.RECEIVE_PROPOSAL_COMMENTS]: () => receive("proposalComments", state, action),
  [act.REQUEST_NEW_PROPOSAL]: () => request("newProposal", state, action),
  [act.RECEIVE_NEW_PROPOSAL]: () => receive("newProposal", state, action),
  [act.REQUEST_NEW_COMMENT]: () => request("newComment", state, action),
  [act.RECEIVE_NEW_COMMENT]: () => onReceiveNewComment(state, action),
  [act.REQUEST_FORGOTTEN_PASSWORD_REQUEST]: () => request("forgottenPassword", state, action),
  [act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST]: () => receive("forgottenPassword", state, action),
  [act.RESET_FORGOTTEN_PASSWORD_REQUEST]: () => reset("forgottenPassword", state),
  [act.REQUEST_PASSWORD_RESET_REQUEST]: () => request("passwordReset", state, action),
  [act.RECEIVE_PASSWORD_RESET_REQUEST]: () => receive("passwordReset", state, action),
  [act.RESET_PROPOSAL]: () => reset("newProposal", state),
  [act.REDIRECTED_FROM]: () => ({ ...state, login: { ...state.login, redirectedFrom: action.payload } }),
  [act.RESET_REDIRECTED_FROM]: () => reset("login", state),
  [act.REQUEST_SETSTATUS_PROPOSAL]: () => request("setStatusProposal", state, action),
  [act.RECEIVE_SETSTATUS_PROPOSAL]: () => onReceiveSetStatus(state, action),
  [act.RECEIVE_START_VOTE]: () => receive("startVote", state, action),
  [act.REQUEST_START_VOTE]: () => request("startVote", state, action),
  [act.REQUEST_UPDATED_KEY]: () => request("updateUserKey", state, action),
  [act.RECEIVE_UPDATED_KEY]: () => receive("updateUserKey", state, action),
  [act.REQUEST_VERIFIED_KEY]: () => request("verifyUserKey", state, action),
  [act.RECEIVE_VERIFIED_KEY]: () => receive("verifyUserKey", state, action),
  [act.KEY_MISMATCH]: () => ({ ...state, keyMismatch: action.payload }),
  [act.REQUEST_ACTIVE_VOTES]: () => request("activeVotes", state, action),
  [act.RECEIVE_ACTIVE_VOTES]: () => receive("activeVotes", state, action),
  [act.REQUEST_VOTE_RESULTS]: () => request("voteResults", state, action),
  [act.RECEIVE_VOTE_RESULTS]: () => receive("voteResults", state, action),
  [act.REQUEST_LOGOUT]: () => request("logout", state, action),
  [act.RECEIVE_LOGOUT]: () => {
    state = receive("logout", state, action);
    return {
      ...state,
      login: { ...state.login, response: null },
      me: { ...state.me, response: null }
    };
  }
})[action.type] || (() => state))();

export default api;
