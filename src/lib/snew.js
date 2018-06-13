import get from "lodash/fp/get";
import map from "lodash/fp/map";
import reduce from "lodash/fp/reduce";
import compose from "lodash/fp/compose";
import { TOP_LEVEL_COMMENT_PARENTID } from "./api";

const setVotePayload = (proposal, activeVotes) => {
  if(!activeVotes || activeVotes.length === 0) {
    return proposal;
  }
  const findProp = activeVotes.filter(aV =>
    aV.proposal &&
    aV.proposal.censorshiprecord &&
    proposal &&
    proposal.censorshiprecord &&
    aV.proposal.censorshiprecord.token === proposal.censorshiprecord.token
  )[0];
  if(!findProp)
    return proposal;

  const obj = {
    ...proposal,
    ...findProp
  };
  delete obj.proposal;
  return obj;
};

export const proposalToT3 = ({
  startvote, startvotereply, name, timestamp, status, userid, username, numcomments, censorshiprecord = {}
}, idx) => ({
  kind: "t3",
  data: {
    authorid: userid,
    author: username,
    numcomments,
    rank: idx + 1,
    title: name || "(Proposal name hidden)",
    id: censorshiprecord.token,
    name: "t3_"+censorshiprecord.token,
    review_status: status,
    created_utc: timestamp,
    permalink: `/proposals/${censorshiprecord.token}/`,
    url: `/proposals/${censorshiprecord.token}/`,
    is_self: true,
    startvote,
    startvotereply
  }
});

export const formatProposalData = (proposal, idx, activeVote = null) => proposalToT3(setVotePayload(proposal, activeVote), idx);

const getChildComments = ({ tree, comments }, parentid) => map(
  compose(
    data => ({
      kind: "t1",
      data: {
        ...data,
        replies: {
          data: {
            children: (data.id && getChildComments({ tree, comments }, data.id)) || []
          }
        }
      }
    }),
    id => comments[id]
  ),
  get(parentid || TOP_LEVEL_COMMENT_PARENTID, tree) || []
);

export const commentsToT1 = compose(
  getChildComments,
  reduce(
    (r, { commentid, userid, username, parentid, token, comment, timestamp, resultvotes }) => ({
      ...r,
      comments: {
        ...r.comments,
        [commentid]: {
          id: commentid,
          author: username || userid,
          score: resultvotes,
          ups: 3,
          downs: 15,
          score_hidden: false,
          parent_id: parentid || TOP_LEVEL_COMMENT_PARENTID,
          name: commentid,
          body: comment,
          created_utc: timestamp,
          permalink: `/proposals/${token}/comments/${commentid}`
        }
      },
      tree: {
        ...r.tree,
        [parentid || TOP_LEVEL_COMMENT_PARENTID]: [
          ...(get(["tree", parentid || TOP_LEVEL_COMMENT_PARENTID], r) || []),
          commentid
        ]
      }
    }),
    { tree: {}, comments: {} }
  )
);
