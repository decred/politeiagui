import * as api from "../api";
import cloneDeep from "lodash/cloneDeep";

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
    return newState;
  };

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

    expect(stateAfterReset.commentsvotes.response.commentsvotes).toEqual(initialState.commentsvotes.response.commentsvotes);
    expect(stateAfterReset.proposalComments.response.comments).toEqual(initialState.proposalComments.response.comments);
  });
});
