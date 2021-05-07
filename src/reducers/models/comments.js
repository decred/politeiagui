import * as act from "src/actions/types";
import cloneDeep from "lodash/cloneDeep";
import uniqWith from "lodash/uniqWith";
import reverse from "lodash/reverse";
import unionBy from "lodash/unionBy";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";
import {
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED
} from "../../constants";

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
            const fullToken = comments[0]?.token || token;
            // Filter duplicated comments by signature. The latest copy found
            // will be kept.
            const filteredComments = uniqWith(
              reverse(comments),
              (arrVal, othVal) =>
                arrVal.signature && arrVal.signaure !== othVal.signaure
            );
            return compose(
              set(["comments", "byToken", fullToken], filteredComments),
              set(["comments", "accessTimeByToken", fullToken], accesstime)
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
            const { token, votes } = action.payload;
            return set(
              ["commentsLikes", "byToken", token],
              votes
            )(state);
          },
          [act.RECEIVE_SYNC_LIKE_COMMENT]: () => {
            const { token, vote, commentid } = action.payload;
            const commentsLikes = state.commentsLikes.byToken[token];
            const backupForCommentLikes = cloneDeep(commentsLikes);
            const comments = state.comments.byToken[token];
            const isTargetCommentLike = (commentLike) =>
              commentLike.commentid === commentid &&
              commentLike.token === token;
            const oldCommentVote =
              commentsLikes && commentsLikes.find(isTargetCommentLike);

            const oldVote = oldCommentVote ? oldCommentVote.vote : 0;

            const newCommentLike = {
              ...oldCommentVote,
              token,
              commentid,
              vote: vote === oldVote ? 0 : vote
            };
            const newCommentsLikes = unionBy(
              [newCommentLike],
              commentsLikes,
              "commentid"
            );

            const updateCommentVotes = (comment) => {
              if (comment.commentid !== commentid) return comment;

              let newUpvotes = comment.upvotes;
              let newDownvotes = comment.downvotes;
              // if prev vote equals vote, reset the vote
              if (oldVote === vote) {
                if (vote > 0) {
                  // means upvote, reset upvotes and leave downvotes
                  newUpvotes--;
                } else {
                  // means downvote, reset downvotes and leave upvotes
                  newDownvotes--;
                }
              } else if (oldVote !== 0) {
                // if prev vote and vote are different and oldVote is different than 0, decrement prev vote and increment vote
                if (vote > 0) {
                  // means upvote, inc upvote and dec downvote
                  newUpvotes++;
                  newDownvotes--;
                } else {
                  // means downvote, dec upvote and inc downvote
                  newUpvotes--;
                  newDownvotes++;
                }
              } else if (vote > 0) {
                // if oldVote is 0 (no option selected), just increment the vote option
                newUpvotes++;
              } else {
                newDownvotes++;
              }

              console.log("ooopa");
              console.log(oldVote);
              console.log(vote);

              return {
                ...comment,
                upvotes: newUpvotes,
                downvotes: newDownvotes
              };
            };

            return compose(
              set(["commentsLikes", "backup"], backupForCommentLikes),
              set(["commentsLikes", "byToken", token], newCommentsLikes),
              set(["comments", "backup"], comments),
              update(["comments", "byToken", token], (value) =>
                value.map(updateCommentVotes)
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
            const censorTargetComment = (comment) => {
              if (comment.commentid !== commentid) return comment;
              return {
                ...comment,
                deleted: true,
                comment: ""
              };
            };
            return compose(
              update(["comments", "byToken", token], (comments) =>
                comments.map(censorTargetComment)
              )
            )(state);
          },
          [act.RECEIVE_SETSTATUS_PROPOSAL]: () => {
            const { proposal, oldStatus } = action.payload;
            if (
              proposal.status === PROPOSAL_STATUS_PUBLIC &&
              oldStatus === PROPOSAL_STATUS_UNREVIEWED
            ) {
              delete state.comments.byToken[proposal.censorshiprecord.token];
            }
            return state;
          },
          [act.RECEIVE_LOGOUT]: () => DEFAULT_STATE,
          [act.RECEIVE_CMS_LOGOUT]: () => DEFAULT_STATE
        }[action.type] || (() => state)
      )();

export default comments;
