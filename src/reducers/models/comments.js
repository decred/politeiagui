import * as act from "src/actions/types";
import uniqWith from "lodash/uniqWith";
import reverse from "lodash/reverse";
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

const olderVotesFirst = (a, b) => a.timestamp - b.timestamp;

const calcScoreByComment = (votes) => {
  return votes.sort(olderVotesFirst).reduce((accObj, currentVote) => {
    const id = currentVote.commentid;
    if (!accObj[id] || accObj[id] !== currentVote.vote) {
      // no vote found or old vote is different than new vote. Vote option is the chosen option
      return {
        ...accObj,
        [id]: currentVote.vote
      };
    } else {
      // old vote is equals new vote. Set score to 0
      return {
        ...accObj,
        [id]: 0
      };
    }
  }, {});
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
            const commentsUserVote = calcScoreByComment(votes);
            return set(
              ["commentsLikes", "byToken", shortRecordToken(token)],
              commentsUserVote
            )(state);
          },
          [act.RECEIVE_LIKE_COMMENT]: () => {
            const { token, vote, commentid } = action.payload;
            const shortToken = shortRecordToken(token);
            const commentsLikes = state.commentsLikes.byToken[shortToken];
            const oldVote = commentsLikes
              ? commentsLikes[commentid]
                ? commentsLikes[commentid]
                : 0
              : 0;
            const newCommentsLikes = commentsLikes;

            // calc new use option
            if (oldVote === 0 || oldVote !== vote) {
              newCommentsLikes[commentid] = vote;
            } else {
              newCommentsLikes[commentid] = 0;
            }

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
              set(["commentsLikes", "byToken", shortToken], newCommentsLikes),
              /* This will cause some delay to update up/downvotes if there are
              a lot of comments in the page. This happens because we have to
              recreate the comments array all the time due to the redux
              immutability pattern. Will be improved when we migrate to the
              plugins structure. */
              update(["comments", "byToken", shortToken], (value) =>
                value.map(updateCommentVotes)
              )
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
              update(
                ["comments", "byToken", shortRecordToken(token)],
                (comments) => comments.map(censorTargetComment)
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
