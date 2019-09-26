import * as act from "src/actions/types";

const DEFAULT_STATE = {
  commentsByToken: {}
};

const models = (state = DEFAULT_STATE, action) =>
  (({
    [act.RECEIVE_PROPOSAL_COMMENTS]: () => {
      return {
        ...state,
        commentsByToken: {
          ...state.commentsByToken,
          [action.payload.token]: {
            comments: action.payload.comments,
            accessTime: action.payload.accesstime
          }
        }
      };
    },
    [act.RECEIVE_NEW_COMMENT]: () => {
      const comment = action.payload;
      const currentComments = state.commentsByToken[comment.token]
        ? state.commentsByToken[comment.token].comments
        : [];
      return {
        ...state,
        commentsByToken: {
          ...state.commentsByToken,
          [comment.token]: {
            ...state.commentsByToken[comment.token],
            comments: [...currentComments, comment]
          }
        }
      };
    }
  }[action.type] || (() => state))());

export default models;
