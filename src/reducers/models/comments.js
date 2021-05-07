import * as act from "src/actions/types";
import cloneDeep from "lodash/cloneDeep";
import uniqWith from "lodash/uniqWith";
import reverse from "lodash/reverse";
import unionBy from "lodash/unionBy";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";
import { shortRecordToken } from "src/helpers";
import {
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED
} from "../../constants";

const DEFAULT_STATE = {
  comments: { byToken: {}, accessTimeByToken: {}, backup: null },
  commentsLikes: { byToken: {}, backup: null }
};

const calcVotes = (comment, oldVote, vote) => {
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

  return { newUpvotes, newDownvotes };
};

const comments = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_RECORD_COMMENTS]: () => {
            const { token, comments, accesstime } = action.payload;
            const shortToken = shortRecordToken(token);
            // Filter duplicated comments by signature. The latest copy found
            // will be kept.
            const filteredComments = uniqWith(
              reverse(comments),
              (arrVal, othVal) =>
                arrVal.signature && arrVal.signaure !== othVal.signaure
            );
            return compose(
              set(["comments", "byToken", shortToken], filteredComments),
              set(["comments", "accessTimeByToken", shortToken], accesstime)
            )(state);
          },
          [act.RECEIVE_NEW_COMMENT]: () => {
            const comment = action.payload;
            return update(
              ["comments", "byToken", shortRecordToken(comment.token)],
              (comments = []) => [...comments, comment]
            )(state);
          },
          [act.RECEIVE_LIKED_COMMENTS]: () => {
            const { token, votes } = action.payload;
            return set(["commentsLikes", "byToken", shortRecordToken(token)], votes)(state);
          },
          [act.RECEIVE_SYNC_LIKE_COMMENT]: () => {
            const { token, vote, commentid } = action.payload;
            const shortToken = shortRecordToken(token);
            const commentsLikes = state.commentsLikes.byToken[shortToken];
            const backupForCommentLikes = cloneDeep(commentsLikes);
            const comments = state.comments.byToken[shortToken];
            const isTargetCommentLike = (commentLike) =>
              commentLike.commentid === commentid &&
              commentLike.token === shortToken;
            const oldCommentVote =
              commentsLikes && commentsLikes.find(isTargetCommentLike);

            const oldVote = oldCommentVote ? oldCommentVote.vote : 0;

            const newCommentLike = {
              ...oldCommentVote,
              shortToken,
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

              const { newUpvotes, newDownvotes } = calcVotes(
                comment,
                oldVote,
                vote
              );

              return {
                ...comment,
                upvotes: newUpvotes,
                downvotes: newDownvotes
              };
            };

            return compose(
              set(["commentsLikes", "backup"], backupForCommentLikes),
              set(["commentsLikes", "byToken", shortToken], newCommentsLikes),
              set(["comments", "backup"], comments),
              update(["comments", "byToken", shortToken], (value) =>
                value.map(updateCommentVotes)
              )
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
              update(["comments", "byToken", shortRecordToken(token)], (comments) =>
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
              delete state.comments.byToken[
                shortRecordToken(proposal.censorshiprecord.token)
              ];
            }
            return state;
          },
          [act.RECEIVE_LOGOUT]: () => DEFAULT_STATE,
          [act.RECEIVE_CMS_LOGOUT]: () => DEFAULT_STATE
        }[action.type] || (() => state)
      )();

export default comments;
