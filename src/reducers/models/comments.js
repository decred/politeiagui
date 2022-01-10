import * as act from "src/actions/types";
import uniqWith from "lodash/uniqWith";
import reverse from "lodash/reverse";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import get from "lodash/fp/get";
import find from "lodash/fp/find";
import update from "lodash/fp/update";
import { shortRecordToken, calculateAuthorUpdateTree } from "src/helpers";
import {
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_MAIN_THREAD_KEY,
  PROPOSAL_UPDATE_HINT,
  PROPOSAL_STATE_UNVETTED
} from "src/constants";

const DEFAULT_STATE = {
  comments: { byToken: {}, accessTimeByToken: {}, backup: null },
  commentsVotes: { byToken: {}, backup: null },
  commentsLikes: { byToken: {}, backup: null }
};

const olderVotesFirst = (a, b) => a.timestamp - b.timestamp;

const calcScoreByComment = (votes) => {
  return votes.sort(olderVotesFirst).reduce((accObj, currentVote) => {
    const id = currentVote.commentid;
    if (!accObj[id] || accObj[id] !== currentVote.vote) {
      // no vote found or old vote is different than new vote. Vote option
      // is the chosen option.
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
    ? action.type === act.RECEIVE_LIKE_COMMENT
      ? /* if like comment action receives an error, restore data from backup */
        (function restoreLikesFromBackup() {
          const { token, commentid, oldVote } = get([
            "commentsLikes",
            "backup"
          ])(state);
          const oldCommentVotes = get(["commentsVotes", "backup"])(state);

          return compose(
            set(["commentsLikes", "backup"], null),
            update(["commentsLikes", "byToken", token], (current) => ({
              ...current,
              [commentid]: oldVote
            })),
            update(["commentsVotes", "byToken", token], (current) => ({
              ...current,
              [commentid]: oldCommentVotes
            }))
          )(state);
        })()
      : state
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

            // Find author update ids.
            const authorUpdateIds = filteredComments
              .filter(
                ({ extradatahint }) => extradatahint === PROPOSAL_UPDATE_HINT
              )
              .map(({ commentid }) => commentid);

            const sectionIds = [...authorUpdateIds, PROPOSAL_MAIN_THREAD_KEY];

            // Calculate comments tree for each author update to display each
            // one of them in a separate comments section.
            const commentsMap = {};
            let authorUpdateThreads = [];
            authorUpdateIds.forEach((updateId) => {
              const authorUpdateTree = calculateAuthorUpdateTree(
                updateId,
                filteredComments
              );
              authorUpdateThreads = [
                ...authorUpdateThreads,
                ...authorUpdateTree
              ];
              commentsMap[updateId] = filteredComments.filter(({ commentid }) =>
                authorUpdateTree.includes(commentid)
              );
            });
            commentsMap[PROPOSAL_MAIN_THREAD_KEY] = filteredComments.filter(
              ({ commentid }) => !authorUpdateThreads.includes(commentid)
            );

            return compose(
              set(["comments", "byToken", shortToken], {
                sectionIds,
                comments: commentsMap
              }),
              set(["comments", "accessTimeByToken", shortToken], accesstime)
            )(state);
          },
          [act.RECEIVE_NEW_COMMENT]: () => {
            const { sectionId, ...comment } = action.payload;
            const shortToken = shortRecordToken(comment.token);
            // If comment's section id is not known then we are dealing
            // with a new author update and the section id should be
            // added to the section ids array.
            const { sectionIds } = state.comments.byToken[shortToken];
            const isNewSectionId = !sectionIds.includes(sectionId);
            return compose(
              update(
                ["comments", "byToken", shortToken, "comments", sectionId],
                (comments = []) => [comment, ...comments]
              ),
              isNewSectionId
                ? set(
                    ["comments", "byToken", shortToken, "sectionIds"],
                    [sectionId, ...sectionIds]
                  )
                : (state) => state
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
          [act.REQUEST_LIKE_COMMENT]: () => {
            const { token, vote, commentid, sectionId } = action.payload;
            const shortToken = shortRecordToken(token);
            const oldComment = compose(
              find((c) => c.commentid === commentid),
              get(["comments", "byToken", shortToken, "comments", sectionId])
            )(state);
            const commentsLikes = state.commentsLikes.byToken[shortToken];
            const oldCommentsVotes = get([
              "commentsVotes",
              "byToken",
              shortToken,
              commentid
            ])(state);
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

            const { newUpvotes, newDownvotes } = calcVotes(
              oldCommentsVotes || oldComment,
              oldVote,
              vote
            );
            const votes = {
              upvotes: newUpvotes,
              downvotes: newDownvotes
            };

            return compose(
              set(["commentsLikes", "byToken", shortToken], newCommentsLikes),
              /* backup the old vote and comment to restore in case of error */
              set(["commentsLikes", "backup"], {
                token: shortToken,
                commentid,
                oldVote,
                oldComment
              }),
              set(["commentsVotes", "backup"], {
                downvotes: oldComment.downvotes,
                upvotes: oldComment.upvotes
              }),
              update(["commentsVotes", "byToken", shortToken], (current) => ({
                ...current,
                [commentid]: votes
              }))
            )(state);
          },
          [act.RECEIVE_LIKE_COMMENT_SUCCESS]: () => {
            const { token, commentid, sectionId } = action.payload;
            const shortToken = shortRecordToken(token);
            const { upvotes, downvotes } =
              state.commentsVotes.byToken[shortToken][commentid];
            return update(
              ["comments", "byToken", shortToken, "comments", sectionId],
              (comments) =>
                comments.map((comment) => {
                  if (comment.commentid !== commentid) return comment;
                  return { ...comment, upvotes, downvotes };
                })
            )(state);
          },
          [act.RECEIVE_CENSOR_COMMENT]: () => {
            const { commentid, token, sectionId, reason } = action.payload;
            const censorTargetComment = (comment) => {
              if (comment.commentid !== commentid) return comment;
              return {
                ...comment,
                deleted: true,
                comment: "",
                reason
              };
            };
            return compose(
              update(
                [
                  "comments",
                  "byToken",
                  shortRecordToken(token),
                  "comments",
                  sectionId
                ],
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
          [act.RECEIVE_LOGOUT]: function removeUnvettedComments() {
            return update(["comments", "byToken"], (commentsByToken) =>
              Object.keys(commentsByToken).reduce((acc, token) => {
                const { sectionIds, comments } = commentsByToken[token];
                const isUnvetted = sectionIds.some((sec) =>
                  comments[sec].some(
                    ({ state }) => state === PROPOSAL_STATE_UNVETTED
                  )
                );
                return isUnvetted
                  ? { ...acc }
                  : { ...acc, [token]: commentsByToken[token] };
              }, {})
            )(state);
          },
          [act.RECEIVE_CMS_LOGOUT]: () => DEFAULT_STATE
        }[action.type] || (() => state)
      )();

export default comments;
