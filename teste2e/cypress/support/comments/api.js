import { Comment, Vote } from "./generate";
import faker from "faker";

export const API_BASE_URL = "/api/comments/v1";

/**
 * policyReply is the reply to the Policy command. The returned maps are
 * { [rule]: value }, where `rule` is the policy rule.
 *
 * @returns {Object} Policy
 */
export function policyReply({
  testParams: {
    lengthmax = 8000,
    votechangesmax = 5,
    countpagesize = 10,
    timestampspagesize = 100,
    allowedits = true,
    editperiod = 300
  }
}) {
  return {
    lengthmax,
    votechangesmax,
    countpagesize,
    timestampspagesize,
    allowedits,
    editperiod
  };
}

/**
 * countReply is the reply to the Count command. The returned maps are
 * { [token]: count } where `token` is the Record token and `count` is the
 * comments count.
 *
 * @param {Object} { testParams, requestParams }
 * @returns {Object} count map
 */
export function countReply({
  testParams: { count = 0 },
  requestParams: { tokens = [] }
}) {
  const counts = tokens.reduce(
    (acc, token) => ({ ...acc, [token]: count }),
    {}
  );
  return { counts };
}

/**
 * commentsReply represents '/api/comments/v1/comments' endpoint.
 *
 * @param {Object} { testParams, requestParams }
 * @returns {Object} { comments }
 */
export function commentsReply({
  testParams: { count = 0, maxUpvote = 0, maxDownVote = 0 },
  requestParams: { token }
}) {
  const comments = [];
  if (count > 0) {
    for (let commentid = 1; commentid <= count; commentid++) {
      comments.push(new Comment({ commentid, token, maxUpvote, maxDownVote }));
    }
  }
  return { comments };
}

/**
 * newCommentReply represents '/api/comments/v1/new' endpoint.
 * it is called when the user is submitting a new comment.
 *
 * @param {Object} { testParams, requestParams }
 * @returns {Object} { comment }
 */
export function newCommentReply({
  testParams: { user, commentid },
  requestParams: {
    comment,
    parentid,
    publickey,
    signature,
    state,
    token,
    extradata,
    extradatahint
  }
}) {
  return {
    comment: new Comment({
      user,
      commentid,
      comment,
      parentid,
      publickey,
      signature,
      state,
      token,
      extradata,
      extradatahint,
      createdat: new Date().getTime() / 1000
    })
  };
}

/**
 * editCommentReply represents '/api/comments/v1/edit' endpoint.
 * it is called when the user is editing a just created comment.
 *
 * @param {Object} { testParams, requestParams }
 * @returns {Object} { comment }
 */
export function editCommentReply({
  testParams: { user },
  requestParams: {
    comment,
    commentid,
    extradata,
    extradatahint,
    parentid,
    publickey,
    signature,
    state,
    token,
    userid
  }
}) {
  return {
    comment: new Comment({
      user,
      commentid,
      comment,
      parentid,
      publickey,
      signature,
      state,
      token,
      extradata,
      extradatahint,
      userid
    })
  };
}

/**
 * votesEmptyReply represents '/api/comments/v1/votes' endpoint.
 * it returns a list of votes the logging in user votes on comments.
 *
 * @param {Object} { testParams, requestParams }
 * @returns {Object} { comments }
 */
export function votesReply({
  testParams: { user, maxCommentID, amount },
  requestParams: { token, userid }
}) {
  const votes = [];
  for (let i = 0; i < amount; i++) {
    votes.push(new Vote({ token, userid, user, maxCommentID }));
  }
  return { votes };
}

/**
 * votesEmptyReply represents '/api/comments/v1/vote' endpoint.
 * which is called when the user vote on a comment.
 *
 * @param {Object} { testParams, requestParams }
 * @returns {Object} { downvotes, upvotes, timestamp, receipt }
 */
export function voteReply({ requestParams: { vote } }) {
  const upvotes = vote === 1 ? 1 : 0;
  const downvotes = vote === 1 ? 0 : 1;
  return {
    downvotes,
    upvotes,
    timestamp: new Date().getTime() / 1000,
    receipt: faker.datatype.hexaDecimal(128, false, /[0-9a-z]/)
  };
}

/**
 * timestampsReply represents the data of /api/comments/v1/timestamps endpoint
 * It currently returns empty data since it is serving the data for downloading
 * and we just check the existence of the downloaded file.
 *
 * @param {Object} { requestParams }
 * @returns {Object} { comments }
 */
export function timestampsReply() {
  return {
    comments: {}
  };
}

/**
 * delReply represents the replier for /api/comments/v1/del endpoint. It returns
 * a deleted comment including the censorship reason.
 *
 * @param {Object} { requestParams }
 * @returns {Object} { comment }
 */
export function delReply({
  testParams: { userid },
  requestParams: { reason, commentid, token }
}) {
  return {
    comment: new Comment({
      commentid,
      userid,
      comment: "",
      reason,
      token,
      deleted: true
    })
  };
}

export const repliers = {
  policy: policyReply,
  count: countReply,
  comments: commentsReply,
  votes: votesReply,
  new: newCommentReply,
  edit: editCommentReply,
  vote: voteReply,
  timestamps: timestampsReply,
  del: delReply
};
