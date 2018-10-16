import * as act from "../actions/types";
import get from "lodash/fp/get";
import map from "lodash/fp/map";
import unionWith from "lodash/unionWith";
import cloneDeep from "lodash/cloneDeep";
import { DEFAULT_REQUEST_STATE, request, receive, reset, resetMultiple } from "./util";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  PROPOSAL_STATUS_PUBLIC
} from "../constants";


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
  censorComment: DEFAULT_REQUEST_STATE,
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
  unvettedStatus: DEFAULT_REQUEST_STATE,
  proposalPaywallPayment: DEFAULT_REQUEST_STATE,
  email: "",
  keyMismatch: false,
  lastLoaded: {}
};

export const onReceiveSetStatus = (state, action) => {
  state = receive("setStatusProposal", state, action);
  if (action.error) return state;
  const getProposalToken = prop => get([ "censorshiprecord", "token" ], prop);

  const updatedProposal = {
    ...action.payload.proposal,
    files: get([ "proposal",  "response", "proposal", "files" ], state) || [],
    username: get([ "proposal",  "response", "proposal", "username" ], state) || ""
  };

  const viewedProposal = get([ "proposal", "response", "proposal" ], state);

  const updateProposalStatus = proposal =>
    getProposalToken(updatedProposal) === getProposalToken(proposal) ?
      updatedProposal : proposal;

  let unvettedProps = get([ "unvetted", "response", "proposals" ], state) || [];
  let vettedProps = get([ "vetted", "response", "proposals" ], state) || [];

  if(updatedProposal.status === PROPOSAL_STATUS_PUBLIC) {
    // remove from unvetted list
    unvettedProps = unvettedProps.filter(proposal =>
      getProposalToken(updatedProposal) !== getProposalToken(proposal)
    );
    // add to vetted list
    vettedProps = [updatedProposal].concat(vettedProps);
  } else {
    unvettedProps = map(updateProposalStatus, unvettedProps);
  }

  return {
    ...state,
    proposal: viewedProposal
      ? ({
        ...state.proposal,
        response: {
          ...state.proposal.response,
          proposal: updatedProposal
        }
      }) : state.proposal,
    unvetted: {
      ...state.unvetted,
      response: {
        ...state.unvetted.response,
        proposals: unvettedProps
      }
    },
    vetted: {
      ...state.vetted,
      response: {
        ...state.vetted.response,
        proposals: vettedProps
      }
    }
  };
};

const onReceiveCensoredComment = (state, action) => {
  state = receive("censorComment", state, action);
  if (action.error) return state;

  return {
    ...state,
    proposalComments: {
      ...state.proposalComments,
      response: {
        ...state.proposalComments.response,
        comments: state.proposalComments.response.comments.map(c => {
          return c.commentid === action.payload ?
            { ...c, comment: "", censored: true } : c;
        })
      }
    }
  };
};

export const onReceiveNewComment = (state, action) => {
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
            userid: state.newComment.response.userid,
            username: state.me.response.username,
            isadmin: state.me.response.isadmin,
            totalvotes: 0,
            resultvotes: 0,
            commentid: state.newComment.response.commentid,
            timestamp: Date.now() / 1000
          }
        ]
      }
    }
  };
};

export const onResetSyncLikeComment = (state) => {
  const { backup: commentsVotesBackup } = state.commentsvotes;
  const { backup: proposalCommentsBackup } = state.proposalComments;
  return {
    ...state,
    commentsvotes: {
      ...state.commentsvotes,
      backup: null,
      response: {
        commentsvotes: commentsVotesBackup
      }
    },
    proposalComments: {
      ...state.proposalComments,
      backup: null,
      response: {
        ...state.proposalComments.response,
        comments: proposalCommentsBackup
      }
    }
  };
};

export const onReceiveSyncLikeComment = (state, action) => {
  const { token, action: cAction, commentid } = action.payload;
  const newAction = parseInt(cAction, 10);

  const commentsvotes = state.commentsvotes.response &&
    state.commentsvotes.response.commentsvotes;
  const backupCV = cloneDeep(commentsvotes);
  const comments = state.proposalComments.response &&
    state.proposalComments.response.comments;

  let reducedVotes = null;
  const cvfound = commentsvotes && commentsvotes.find(
    cv => cv.commentid === commentid && cv.token === token
  );

  if (cvfound) {
    reducedVotes = commentsvotes.reduce(
      (acc, cv) => {
        if (cv.commentid === commentid && cv.token === token) {
          const currentAction = parseInt(cv.action, 10);
          acc.oldAction = currentAction;
          cv = {
            ...cv,
            action: newAction === currentAction ? 0 : newAction
          };
        }
        return { ...acc, cvs: acc.cvs.concat([cv]) };
      }, { cvs: [], oldAction: null });
  } else {
    const newCommentVote = { token, commentid, action: newAction };
    reducedVotes = {
      cvs: commentsvotes ? commentsvotes.concat([newCommentVote]) : [newCommentVote],
      oldAction: 0
    };
  }

  const { cvs: newCommentsVotes, oldAction } = reducedVotes;

  return {
    ...state,
    commentsvotes: {
      ...state.commentsvotes,
      backup: backupCV,
      response: {
        commentsvotes: newCommentsVotes
      }
    },
    proposalComments: {
      ...state.proposalComments,
      backup: comments,
      response: {
        ...state.proposalComments.response,
        comments: state.proposalComments.response.comments.map(el => el.commentid === commentid ? {
          ...el,
          totalvotes: el.totalvotes + (oldAction === newAction ? -1 : oldAction === 0 ? 1 : 0),
          resultvotes: el.resultvotes + (oldAction === newAction ? (-oldAction) : newAction - oldAction)
        } : el)
      }
    }
  };
};

export const onReceiveStartVote = (state, action) => {
  state = receive("startVote", state, action);
  const newVoteStatus = {
    token: state.startVote.payload.token,
    status: PROPOSAL_VOTING_ACTIVE,
    optionsresult: null,
    totalvotes: 0,
    endheight: state.startVote.response.endheight
  };
  return {
    ...state,
    proposalsVoteStatus: {
      ...state.proposalsVoteStatus,
      response: {
        ...state.proposalsVoteStatus.response,
        votesstatus: state.proposalsVoteStatus.response.votesstatus ?
          state.proposalsVoteStatus.response.votesstatus
            .map(vs => newVoteStatus.token === vs.token ?
              newVoteStatus : vs) : [newVoteStatus]
      }
    },
    proposalVoteStatus: {
      ...state.proposalsVoteStatus,
      response: {
        ...state.proposalVoteStatus.response,
        ...newVoteStatus
      }
    }
  };
};

export const onReceiveVoteStatusChange = (key, newStatus, state, action) => {
  state = receive(key, state, action);
  if (action.error) return state;

  const newVoteStatus = {
    token: state[key].payload.token,
    status: newStatus,
    optionsresult: null,
    totalvotes: 0
  };
  return {
    ...state,
    proposalsVoteStatus: {
      ...state.proposalsVoteStatus,
      response: {
        ...state.proposalsVoteStatus.response,
        votesstatus: (state.proposalsVoteStatus.response &&
        state.proposalsVoteStatus.response.votesstatus) ?
          state.proposalsVoteStatus.response.votesstatus
            .map(vs => newVoteStatus.token === vs.token ?
              newVoteStatus : vs) : [newVoteStatus]
      }
    },
    proposalVoteStatus: {
      ...state.proposalsVoteStatus,
      response: {
        ...state.proposalVoteStatus.response,
        ...newVoteStatus
      }
    }
  };
};

export const receiveProposals = (key, proposals, state) => {

  const isUnvetted = (prop) =>
    prop.status === PROPOSAL_STATUS_UNREVIEWED || prop.status === PROPOSAL_STATUS_CENSORED
    || prop.status === PROPOSAL_STATUS_UNREVIEWED_CHANGES;

  const lastLoaded = proposals.length > 0 ? proposals[proposals.length - 1] : null;

  const unvettedProps = (state.unvetted.response && state.unvetted.response.proposals) || [];
  const vettedProps = (state.vetted.response && state.vetted.response.proposals) || [];
  const incomingUnvettedProps = proposals.filter(isUnvetted);
  const incomingVettedProps = proposals.filter(prop => !isUnvetted(prop));

  return {
    ...state,
    lastLoaded: {
      ...state.lastLoaded,
      [key]: lastLoaded
    },
    vetted: {
      ...state.vetted,
      response: {
        ...state.vetted.response,
        proposals: unionWith(incomingVettedProps, vettedProps, (a, b) => {
          return a.censorshiprecord.token === b.censorshiprecord.token;
        })
      }
    },
    unvetted: {
      ...state.unvetted,
      response: {
        ...state.vetted.response,
        proposals: unionWith(incomingUnvettedProps, unvettedProps, (a, b) => {
          return a.censorshiprecord.token === b.censorshiprecord.token;
        })
      }
    }
  };
};

export const onReceiveProposals = (key, state, { payload, error }) => {

  const auxPayload = cloneDeep(payload);
  if (auxPayload.proposals) {
    delete auxPayload.proposals;
  }

  state = {
    ...state,
    [key]: {
      ...state[key],
      response: {
        ...state[key].response,
        ...auxPayload
      },
      isRequesting: false,
      error: error ? payload : null
    }
  };

  const proposals =  payload.proposals || [];
  return receiveProposals(key, proposals, state);
};

export const onReceiveUser = (state, action) => {
  state = receive("user", state, action);
  if (action.error) return state;

  const userProps = action.payload.user.proposals || [];
  return receiveProposals("user", userProps, state);
};

const api = (state = DEFAULT_STATE, action) => (({
  [act.SET_EMAIL]: () => ({ ...state, email: action.payload }),
  [act.CLEAN_ERRORS]: () => (
    Object.keys(state).reduce((acc, curr) => {
      if (typeof state[curr] === "object") {
        acc[curr] = Object.assign({}, state[curr], { error: null });
      } else {
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
  [act.REQUEST_USER]: () => request("user", state, action),
  [act.RECEIVE_USER]: () => onReceiveUser(state, action),
  [act.REQUEST_LOGIN]: () => request("login", state, action),
  [act.RECEIVE_LOGIN]: () => receive("login", state, action),
  [act.REQUEST_CHANGE_USERNAME]: () => request("changeUsername", state, action),
  [act.RECEIVE_CHANGE_USERNAME]: () => receive("changeUsername", state, action),
  [act.REQUEST_CHANGE_PASSWORD]: () => request("changePassword", state, action),
  [act.RECEIVE_CHANGE_PASSWORD]: () => receive("changePassword", state, action),
  [act.REQUEST_USER_PROPOSALS]: () => request("userProposals", state, action),
  [act.RECEIVE_USER_PROPOSALS]: () => onReceiveProposals("userProposals", state, action),
  [act.REQUEST_VETTED]: () => request("vetted", state, action),
  [act.RECEIVE_VETTED]: () => onReceiveProposals("vetted", state, action),
  [act.REQUEST_UNVETTED]: () => request("unvetted", state, action),
  [act.RECEIVE_UNVETTED]: () => onReceiveProposals("unvetted", state, action),
  [act.REQUEST_UNVETTED_STATUS]: () => request("unvettedStatus", state, action),
  [act.RECEIVE_UNVETTED_STATUS]: () => receive("unvettedStatus", state, action),
  [act.REQUEST_PROPOSAL]: () => request("proposal", state, action),
  [act.RECEIVE_PROPOSAL]: () => receive("proposal", state, action),
  [act.REQUEST_PROPOSAL_COMMENTS]: () => request("proposalComments", state, action),
  [act.RECEIVE_PROPOSAL_COMMENTS]: () => receive("proposalComments", state, action),
  [act.REQUEST_LIKE_COMMENT]: () => request("likeComment", state, action),
  [act.RECEIVE_LIKE_COMMENT]: () => receive("likeComment", state, action),
  [act.REQUEST_CENSOR_COMMENT]: () => request("censorComment", state, action),
  [act.RECEIVE_CENSOR_COMMENT]: () => onReceiveCensoredComment(state, action),
  [act.RECEIVE_SYNC_LIKE_COMMENT]: () => onReceiveSyncLikeComment(state, action),
  [act.RESET_SYNC_LIKE_COMMENT]: () => onResetSyncLikeComment(state),
  [act.REQUEST_LIKED_COMMENTS]: () => request("commentsvotes", state, action),
  [act.RECEIVE_LIKED_COMMENTS]: () => receive("commentsvotes", state, action),
  [act.REQUEST_EDIT_USER]: () => request("editUser", state, action),
  [act.RECEIVE_EDIT_USER]: () => receive("editUser", state, action),
  [act.REQUEST_NEW_PROPOSAL]: () => request("newProposal", state, action),
  [act.RECEIVE_NEW_PROPOSAL]: () => receive("newProposal", state, action),
  [act.REQUEST_EDIT_PROPOSAL]: () => request("editProposal", state, action),
  [act.RECEIVE_EDIT_PROPOSAL]: () => receive("editProposal", state, action),
  [act.REQUEST_NEW_COMMENT]: () => request("newComment", state, action),
  [act.RECEIVE_NEW_COMMENT]: () => onReceiveNewComment(state, action),
  [act.REQUEST_PROPOSAL_PAYWALL_DETAILS]: () => request("proposalPaywallDetails", state, action),
  [act.RECEIVE_PROPOSAL_PAYWALL_DETAILS]: () => receive("proposalPaywallDetails", state, action),
  [act.REQUEST_UPDATE_PROPOSAL_CREDITS]: () => request("updateProposalCredits", state, action),
  [act.RECEIVE_UPDATE_PROPOSAL_CREDITS]: () => receive("updateProposalCredits", state, action),
  [act.REQUEST_USER_PROPOSAL_CREDITS]: () => request("userProposalCredits", state, action),
  [act.RECEIVE_USER_PROPOSAL_CREDITS]: () => receive("userProposalCredits", state, action),
  [act.REQUEST_FORGOTTEN_PASSWORD_REQUEST]: () => request("forgottenPassword", state, action),
  [act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST]: () => receive("forgottenPassword", state, action),
  [act.RESET_FORGOTTEN_PASSWORD_REQUEST]: () => reset("forgottenPassword", state),
  [act.REQUEST_RESEND_VERIFICATION_EMAIL]: () => request("resendVerificationEmail", state, action),
  [act.RECEIVE_RESEND_VERIFICATION_EMAIL]: () => receive("resendVerificationEmail", state, action),
  [act.RESET_RESEND_VERIFICATION_EMAIL]: () => reset("resendVerificationEmail", state),
  [act.REQUEST_PASSWORD_RESET_REQUEST]: () => request("passwordReset", state, action),
  [act.RECEIVE_PASSWORD_RESET_REQUEST]: () => receive("passwordReset", state, action),
  [act.RESET_PROPOSAL]: () => resetMultiple([ "newProposal", "editProposal" ], state),
  [act.REDIRECTED_FROM]: () => ({ ...state, login: { ...state.login, redirectedFrom: action.payload } }),
  [act.RESET_REDIRECTED_FROM]: () => reset("login", state),
  [act.REQUEST_SETSTATUS_PROPOSAL]: () => request("setStatusProposal", state, action),
  [act.RECEIVE_SETSTATUS_PROPOSAL]: () => onReceiveSetStatus(state, action),
  [act.RECEIVE_START_VOTE]: () => onReceiveVoteStatusChange("startVote", PROPOSAL_VOTING_ACTIVE, state, action),
  [act.REQUEST_START_VOTE]: () => request("startVote", state, action),
  [act.REQUEST_UPDATED_KEY]: () => request("updateUserKey", state, action),
  [act.RECEIVE_UPDATED_KEY]: () => receive("updateUserKey", state, action),
  [act.REQUEST_VERIFIED_KEY]: () => request("verifyUserKey", state, action),
  [act.RECEIVE_VERIFIED_KEY]: () => receive("verifyUserKey", state, action),
  [act.KEY_MISMATCH]: () => ({ ...state, keyMismatch: action.payload }),
  [act.REQUEST_USERNAMES_BY_ID]: () => request("usernamesById", state, action),
  [act.RECEIVE_USERNAMES_BY_ID]: () => receive("usernamesById", state, action),
  [act.REQUEST_LOGOUT]: () => request("logout", state, action),
  [act.REQUEST_PROPOSALS_VOTE_STATUS]: () => request("proposalsVoteStatus", state, action),
  [act.RECEIVE_PROPOSALS_VOTE_STATUS]: () => receive("proposalsVoteStatus", state, action),
  [act.REQUEST_PROPOSAL_VOTE_STATUS]: () => request("proposalVoteStatus", state, action),
  [act.RECEIVE_PROPOSAL_VOTE_STATUS]: () => receive("proposalVoteStatus", state, action),
  [act.REQUEST_AUTHORIZE_VOTE]: () => request("authorizeVote", state, action),
  [act.RECEIVE_AUTHORIZE_VOTE]: () => onReceiveVoteStatusChange("authorizeVote", PROPOSAL_VOTING_AUTHORIZED, state, action),
  [act.RECEIVE_REVOKE_AUTH_VOTE]: () => onReceiveVoteStatusChange("authorizeVote", PROPOSAL_VOTING_NOT_AUTHORIZED, state, action),
  [act.REQUEST_PROPOSAL_PAYWALL_PAYMENT]: () => request("proposalPaywallPayment", state, action),
  [act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT]: () => receive("proposalPaywallPayment", state, action),
  [act.RECEIVE_LOGOUT]: () => {
    if (!action.error) {
      const tempState = DEFAULT_STATE;
      tempState.init = state.init;
      return tempState;
    }
    return {
      ...state,
      logout: {
        ...state.logout,
        response: null,
        isRequesting: false,
        error: {
          message: "Log out failed"
        }
      }
    };
  }
})[action.type] || (() => state))();

export default api;
