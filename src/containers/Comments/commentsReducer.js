import { sortComments } from "./helpers";
import isEqual from "lodash/isEqual";
import maxBy from "lodash/maxBy";

export const initialState = { comments: [], sortOption: undefined };

export const actions = {
  SORT: "sort",
  UPDATE: "update"
};

export const commentsReducer = (state, action) => {
  switch (action.type) {
    case actions.SORT:
      return {
        ...state,
        comments: sortComments(action.sortOption, state.comments),
        sortOption: action.sortOption
      };

    case actions.UPDATE: {
      // Sort option changed: simply add the sorted comments into the state
      if (action.sortOption !== state.sortOption) {
        return {
          ...state,
          sortOption: action.sortOption,
          comments: sortComments(action.sortOption, action.comments)
        };
      }

      // New comment added: find the new comment and add it to the state
      if (action.comments.length > state.comments.length) {
        const addedComment = maxBy(action.comments, (c) => +c.commentid);
        return {
          ...state,
          comments: [addedComment].concat(state.comments)
        };
      }
      // Comment updated: find and update the comments with changes
      return {
        ...state,
        comments: state.comments.map((comment) => {
          const commentFromNewComments = action.comments.find(
            (c) => c.commentid === comment.commentid
          );
          if (!isEqual(comment, commentFromNewComments)) {
            return commentFromNewComments;
          }
          return comment;
        })
      };
    }

    default:
      return state;
  }
};
