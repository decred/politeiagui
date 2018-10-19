import get from "lodash/fp/get";
import map from "lodash/fp/map";
import unionWith from "lodash/unionWith";
import cloneDeep from "lodash/cloneDeep";
import { receive } from "../util";
import {
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  PROPOSAL_STATUS_PUBLIC
} from "../../constants";

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
