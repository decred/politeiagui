import * as act from "src/actions/types";
import cloneDeep from "lodash/cloneDeep";
import uniqBy from "lodash/uniqBy";
import reverse from "lodash/reverse";
import unionBy from "lodash/unionBy";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";

const DEFAULT_STATE = {
  comments: { byToken: {}, accessTimeByToken: {}, backup: null },
  commentsLikes: { byToken: {}, backup: null }
};

const comments = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_RECORD_COMMENTS]: () => {
            const { token, comments, accesstime } = action.payload;
            // Filter duplicated comments by signature. The latest copy found
            // will be kept.
            const filteredComments = uniqBy(reverse(comments), "signature");
            return compose(
              set(["comments", "byToken", token], filteredComments),
              set(["comments", "accessTimeByToken", token], accesstime)
            )(state);
          },
          [act.RECEIVE_NEW_COMMENT]: () => {
            const comment = action.payload;
            return update(
              ["comments", "byToken", comment.token],
              (comments = []) => [...comments, comment]
            )(state);
          },
          [act.RECEIVE_LIKED_COMMENTS]: () => {
            const { token, commentslikes } = action.payload;
            return set(
              ["commentsLikes", "byToken", token],
              commentslikes
            )(state);
          },
          [act.RECEIVE_SYNC_LIKE_COMMENT]: () => {
            const { token, action: cAction, commentid } = action.payload;
            const newAction = parseInt(cAction, 10);
            const commentsLikes = state.commentsLikes.byToken[token];
            const backupForCommentLikes = cloneDeep(commentsLikes);
            const comments = state.comments.byToken[token];
            const isTargetCommentLike = commentLike =>
              commentLike.commentid === commentid &&
              commentLike.token === token;
            const oldCommentLike =
              commentsLikes && commentsLikes.find(isTargetCommentLike);
            const oldAction = oldCommentLike
              ? parseInt(oldCommentLike.action, 10)
              : 0;
            const newCommentLike = {
              token,
              commentid,
              action: newAction === oldAction ? 0 : newAction
            };
            const newCommentsLikes = unionBy(
              [newCommentLike],
              commentsLikes,
              "commentid"
            );

            const updateCommentResultAndTotalVotes = comment => {
              if (comment.commentid !== commentid) return comment;
              const oldActionEqualsNewAction = oldAction === newAction;

              const calcNewTotalVotes = value =>
                value +
                (oldActionEqualsNewAction ? -1 : oldAction === 0 ? 1 : 0);
              const calcNewResultVotes = value =>
                value +
                (oldActionEqualsNewAction ? -oldAction : newAction - oldAction);

              const calcPerActionVotes = action => (value = 0) => {
                if (newAction === action) {
                  if (oldActionEqualsNewAction) return --value;
                  return ++value;
                }
                if (oldAction === action) return --value;
                return value;
              };

              return compose(
                update("totalvotes", calcNewTotalVotes),
                update("resultvotes", calcNewResultVotes),
                update("upvotes", calcPerActionVotes(1)),
                update("downvotes", calcPerActionVotes(-1))
              )(comment);
            };

            return compose(
              set(["commentsLikes", "backup"], backupForCommentLikes),
              set(["commentsLikes", "byToken", token], newCommentsLikes),
              set(["comments", "backup"], comments),
              update(["comments", "byToken", token], value =>
                value.map(updateCommentResultAndTotalVotes)
              )
            )(state);
          },
          [act.RESET_SYNC_LIKE_COMMENT]: () => {
            const { backup: commentsBackup } = state.comments;
            const { backup: commentsLikesBackup } = state.commentsLikes;
            const { token } = action.payload;
            return compose(
              set(["commentsLikes", "backup"], null),
              set(["commentsLikes", "byToken", token], commentsLikesBackup),
              set(["comments", "backup"], null),
              set(["comments", "byToken", token], commentsBackup)
            )(state);
          },
          [act.RECEIVE_LIKE_COMMENT]: () => {
            return compose(
              set(["commentsLikes", "backup"], null),
              set(["comments", "backup"], null)
            )(state);
          },
          [act.RECEIVE_CENSOR_COMMENT]: () => {
            const { commentid, token } = action.payload;
            const censorTargetComment = comment => {
              if (comment.commentid !== commentid) return comment;
              return {
                ...comment,
                censored: true,
                comment: ""
              };
            };
            return compose(
              update(["comments", "byToken", token], comments =>
                comments.map(censorTargetComment)
              )
            )(state);
          }
        }[action.type] || (() => state)
      )();

export default comments;
