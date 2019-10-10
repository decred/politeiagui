import cloneDeep from "lodash/cloneDeep";
import get from "lodash/fp/get";
import map from "lodash/fp/map";
import unionWith from "lodash/unionWith";
import {
  MANAGE_USER_CLEAR_USER_PAYWALL,
  MANAGE_USER_DEACTIVATE,
  MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
  MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  MANAGE_USER_REACTIVATE,
  MANAGE_USER_UNLOCK,
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_VOTING_NOT_AUTHORIZED
} from "../../constants";
import { receive } from "../util";

const getProposalToken = prop => get(["censorshiprecord", "token"], prop);

export const onReceiveSetStatus = (state, action) => {
  state = receive("setStatusProposal", state, action);
  if (action.error) return state;

  const updatedProposal = {
    ...action.payload.proposal,
    files: get(["proposal", "response", "proposal", "files"], state) || []
  };

  const viewedProposal = get(["proposal", "response", "proposal"], state);

  const updateProposalStatus = proposal =>
    getProposalToken(updatedProposal) === getProposalToken(proposal)
      ? updatedProposal
      : proposal;

  let unvettedProps = get(["unvetted", "response", "proposals"], state) || [];
  let vettedProps = get(["vetted", "response", "proposals"], state) || [];

  if (updatedProposal.status === PROPOSAL_STATUS_PUBLIC) {
    // remove from unvetted list
    unvettedProps = unvettedProps.filter(
      proposal =>
        getProposalToken(updatedProposal) !== getProposalToken(proposal)
    );
    // add to vetted list
    vettedProps = [updatedProposal].concat(vettedProps);
  } else if (updatedProposal.status === PROPOSAL_STATUS_ABANDONED) {
    // if status is set to abandoned keep it in the vetted list
    // and update the status
    vettedProps = map(updateProposalStatus, vettedProps);
  } else {
    unvettedProps = map(updateProposalStatus, unvettedProps);
  }

  state = onUpdateTokenInventory(
    updatedProposal.status,
    state,
    getProposalToken(updatedProposal)
  );

  return {
    ...state,
    proposal: viewedProposal
      ? {
          ...state.proposal,
          response: {
            ...state.proposal.response,
            proposal: updatedProposal
          }
        }
      : state.proposal,
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

export const onReceiveCensoredComment = (state, action) => {
  state = receive("censorComment", state, action);
  if (action.error) return state;
  return {
    ...state,
    proposalComments: {
      ...state.proposalComments,
      response: {
        ...state.proposalComments.response,
        comments: state.proposalComments.response.comments.map(c => {
          return c.commentid === action.payload.commentid
            ? { ...c, comment: "", censored: true }
            : c;
        })
      }
    }
  };
};

export const onReceiveNewComment = (state, action) => {
  state = receive("newComment", state, action);
  if (action.error) return state;
  const proposalToken = action.payload.token;
  let newProposals = [];
  const incNumOfComments = proposal => ({
    ...proposal,
    numcomments: proposal.numcomments + 1
  });

  if (state.vetted.response && state.vetted.response.proposals) {
    newProposals = state.vetted.response.proposals.map(p =>
      getProposalToken(p) === proposalToken ? incNumOfComments(p) : p
    );
  }

  const viewedProposal = get(["proposal", "response", "proposal"], state);

  return {
    ...state,
    proposal:
      viewedProposal && getProposalToken(viewedProposal) === proposalToken
        ? {
            ...state.proposal,
            response: {
              ...state.proposal.response,
              proposal: incNumOfComments(viewedProposal)
            }
          }
        : state.proposal,
    vetted: {
      ...state.vetted,
      response: {
        ...state.vetted.response,
        proposals: [...newProposals]
      }
    },
    proposalComments: {
      ...state.proposalComments,
      response: {
        ...state.proposalComments.response,
        comments: [
          ...((state.proposalComments.response &&
            state.proposalComments.response.comments) ||
            []),
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

export const onResetSyncLikeComment = state => {
  const { backup: commentsLikesBackup } = state.commentslikes;
  const { backup: proposalCommentsBackup } = state.proposalComments;
  return {
    ...state,
    commentslikes: {
      ...state.commentslikes,
      backup: null,
      response: {
        commentslikes: commentsLikesBackup
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

export const onReceiveProposalVoteResults = (key, state, action) => {
  state = receive(key, state, action);
  if (action.error) return state;

  const hashmap = state.proposalVoteResults.response.castvotes.reduce(
    (map, obj) => {
      map[obj.ticket] = obj;
      return map;
    },
    {}
  );

  return {
    ...state,
    proposalVoteResults: {
      ...state.proposalVoteResults,
      response: {
        ...state.proposalVoteResults.response,
        castvotes: hashmap
      }
    }
  };
};

export const onReceiveSyncLikeComment = (state, action) => {
  const { token, action: cAction, commentid } = action.payload;
  const newAction = parseInt(cAction, 10);

  const commentslikes =
    state.commentslikes.response && state.commentslikes.response.commentslikes;
  const backupCV = cloneDeep(commentslikes);
  const comments =
    state.proposalComments.response && state.proposalComments.response.comments;

  let reducedVotes = null;
  const cvfound =
    commentslikes &&
    commentslikes.find(cv => cv.commentid === commentid && cv.token === token);

  if (cvfound) {
    reducedVotes = commentslikes.reduce(
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
      },
      { cvs: [], oldAction: null }
    );
  } else {
    const newCommentVote = { token, commentid, action: newAction };
    reducedVotes = {
      cvs: commentslikes
        ? commentslikes.concat([newCommentVote])
        : [newCommentVote],
      oldAction: 0
    };
  }

  const { cvs: newCommentsLikes, oldAction } = reducedVotes;

  return {
    ...state,
    commentslikes: {
      ...state.commentslikes,
      backup: backupCV,
      response: {
        commentslikes: newCommentsLikes
      }
    },
    proposalComments: {
      ...state.proposalComments,
      backup: comments,
      response: {
        ...state.proposalComments.response,
        comments: state.proposalComments.response.comments.map(el =>
          el.commentid === commentid
            ? {
                ...el,
                totalvotes:
                  el.totalvotes +
                  (oldAction === newAction ? -1 : oldAction === 0 ? 1 : 0),
                resultvotes:
                  el.resultvotes +
                  (oldAction === newAction ? -oldAction : newAction - oldAction)
              }
            : el
        )
      }
    }
  };
};

export const onReceiveVoteStatusChange = (key, newStatus, state, action) => {
  state = receive(key, state, action);
  if (action.error) return state;

  const targetToken = state[key].payload.token;

  const proposalVoteSummary =
    get(["proposalsVoteSummary", "response", targetToken], state) || {};

  const newVoteSummary = {
    ...proposalVoteSummary,
    token: state[key].payload.token,
    status: newStatus
  };

  state = onUpdateTokenInventory(newStatus, state, targetToken, true);

  return {
    ...state,
    proposalsVoteSummary: {
      ...state.proposalsVoteSummary,
      response: {
        ...state.proposalsVoteSummary.response,
        [newVoteSummary.token]: { ...newVoteSummary }
      }
    }
  };
};

export const onUpdateTokenInventory = (
  newStatus,
  state,
  token,
  isVoteStatusUpdate = false
) => {
  const tokenInventory = get(["tokenInventory", "response"], state) || {};

  // map only status which can be assigned to a proposal after a user/admin action
  const mapReviewStatusToTokenInventoryStatus = {
    [PROPOSAL_STATUS_UNREVIEWED]: "unreviewed",
    [PROPOSAL_STATUS_UNREVIEWED_CHANGES]: "unreviewed",
    [PROPOSAL_STATUS_CENSORED]: "censored",
    [PROPOSAL_STATUS_PUBLIC]: "pre",
    [PROPOSAL_STATUS_ABANDONED]: "abandoned"
  };

  const mapVotingStatusToTokenInventoryStatus = {
    [PROPOSAL_VOTING_NOT_AUTHORIZED]: "pre",
    [PROPOSAL_VOTING_AUTHORIZED]: "pre",
    [PROPOSAL_VOTING_ACTIVE]: "active"
  };

  const newTokenInventoryStatus = isVoteStatusUpdate
    ? mapVotingStatusToTokenInventoryStatus[newStatus]
    : mapReviewStatusToTokenInventoryStatus[newStatus];

  const newTokenInventory = Object.keys(tokenInventory).reduce((inv, key) => {
    const tokens = tokenInventory[key] || [];
    const foundToken = tokens.find(t => t === token);
    if (foundToken && key !== newTokenInventoryStatus)
      return { ...inv, [key]: tokens.filter(t => t !== token) };

    if (!foundToken && key === newTokenInventoryStatus)
      return { ...inv, [key]: [token].concat(tokens) };

    return { ...inv, [key]: tokens };
  }, {});

  return {
    ...state,
    tokenInventory: {
      ...(state.tokenInventory || {}),
      response: newTokenInventory
    }
  };
};

export const receiveProposals = (key, proposals, state) => {
  const isUnvetted = prop =>
    prop.status === PROPOSAL_STATUS_UNREVIEWED ||
    prop.status === PROPOSAL_STATUS_CENSORED ||
    prop.status === PROPOSAL_STATUS_UNREVIEWED_CHANGES;

  const lastLoaded =
    proposals.length > 0 ? proposals[proposals.length - 1] : null;

  const unvettedProps =
    (state.unvetted.response && state.unvetted.response.proposals) || [];
  const vettedProps =
    (state.vetted.response && state.vetted.response.proposals) || [];
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

  const proposals = payload.proposals || [];
  return receiveProposals(key, proposals, state);
};

export const onReceiveUser = (state, action) => {
  state = receive("user", state, action);
  if (action.error) return state;

  const userProps = action.payload.user.proposals || [];
  return receiveProposals("user", userProps, state);
};

export const onReceiveRescanUserPayments = (state, action) => {
  state = receive("rescanUserPayments", state, action);
  if (action.error) return state;

  const creditsAdded = action.payload.newcredits.length;
  const user = get(["user", "response", "user"], state) || {};
  return {
    ...state,
    user: {
      ...state.user,
      response: {
        ...state.user.response,
        user: {
          ...user,
          proposalcredits: user.proposalcredits + creditsAdded
        }
      }
    }
  };
};

export const onReceiveManageUser = (state, action) => {
  state = receive("manageUser", state, action);
  if (action.error) return state;

  const getExpiredTime = () => {
    const oneHourInMilliseconds = 1000 * 60 * 60;
    return (new Date().getTime() - 168 * oneHourInMilliseconds) / 1000; // -168 hours is 7 days in the past
  };
  const manageUserPayload = get(["manageUser", "payload"], state);
  const user = get(["user", "response", "user"], state);
  const { action: manageAction } = manageUserPayload;

  switch (manageAction) {
    case MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION:
      user.newuserverificationexpiry = getExpiredTime();
      break;
    case MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION:
      user.updatekeyverificationexpiry = getExpiredTime();
      break;
    case MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION:
      user.resetpasswordverificationexpiry = getExpiredTime();
      break;
    case MANAGE_USER_CLEAR_USER_PAYWALL:
      user.newuserpaywallamount = 0;
      break;
    case MANAGE_USER_UNLOCK:
      user.islocked = false;
      break;
    case MANAGE_USER_DEACTIVATE:
      user.isdeactivated = true;
      break;
    case MANAGE_USER_REACTIVATE:
      user.isdeactivated = false;
      break;
    default:
      break;
  }
  return {
    ...state,
    user: {
      ...state.user,
      response: {
        ...state.user.response,
        user: user
      }
    }
  };
};

export const onReceiveProposalsVoteStatus = (state, action) => {
  const newState = receive("proposalsVoteStatus", state, action);
  if (action.error) return newState;

  const proposalsVoteStatus = get(["payload", "votesstatus"], action) || [];

  const data = proposalsVoteStatus.reduce(
    (acc, value) => ({
      ...acc,
      [value.token]: { ...value }
    }),
    {}
  );

  return {
    ...newState,
    proposalsVoteStatus: {
      ...newState.proposalsVoteStatus,
      response: {
        ...state.proposalsVoteStatus.response,
        ...data
      }
    }
  };
};

export const onReceiveProposalsVoteSummary = (state, action) => {
  const newState = receive("proposalsVoteSummary", state, action);
  if (action.error) return newState;
  const proposalsVoteSummaries = get(["payload", "summaries"], action) || [];
  const bestblock = get(["payload", "bestblock"], action) || [];
  const data = Object.keys(proposalsVoteSummaries).reduce((acc, token) => {
    return {
      ...acc,
      [token]: {
        ...proposalsVoteSummaries[token]
      },
      bestblock
    };
  }, {});

  return {
    ...newState,
    proposalsVoteSummary: {
      ...newState.proposalsVoteSummary,
      response: {
        ...state.proposalsVoteSummary.response,
        ...data
      }
    }
  };
};

export const onReceiveProposalVoteStatus = (state, action) => {
  state = receive("proposalVoteStatus", state, action);
  if (action.error) return state;

  const proposalsVoteStatus =
    get(["proposalsVoteStatus", "response"], state) || {};

  return {
    ...state,
    proposalsVoteStatus: {
      ...state.proposalsVoteStatus,
      response: {
        ...proposalsVoteStatus,
        [action.payload.token]: { ...action.payload }
      }
    }
  };
};
