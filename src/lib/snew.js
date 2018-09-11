import get from "lodash/fp/get";
import map from "lodash/fp/map";
import reduce from "lodash/fp/reduce";
import compose from "lodash/fp/compose";
import { TOP_LEVEL_COMMENT_PARENTID } from "./api";

export const proposalToT3 = ({
  name, timestamp, status, userid, username, numcomments, censorshiprecord = {}, draftId = "", version, statuschangemessage
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
    permalink: `/proposals/${censorshiprecord.token || (draftId ? `new?draftid=${draftId}` : "")}`,
    url: `/proposals/${censorshiprecord.token || (draftId ? `new?draftid=${draftId}` : "")}`,
    is_self: true,
    draftId,
    version,
    censorMessage: statuschangemessage
  }
});

export const formatProposalData = (proposal, idx) => proposalToT3(proposal, idx);

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

const commentsIds = new Set();
const parentsIds = new Set();

const hasParent = (parentid) =>
  parentid ? commentsIds.has(parentid) : false;

export const commentsToT1 = compose(
  getChildComments,
  reduce(
    (r, { commentid, userid, username, parentid, token, comment, timestamp, resultvotes, vote }) => ({
      ...r,
      comments: {
        ...r.comments,
        [commentid]: {
          id: commentid,
          uservote: String(vote),
          author: username || userid,
          authorid: userid,
          score: resultvotes,
          score_hidden: false,
          parent_id: hasParent(parentid) ? parentid : TOP_LEVEL_COMMENT_PARENTID,
          name: commentid,
          body: comment,
          created_utc: timestamp,
          permalink: `/proposals/${token}/comments/${commentid}`
        }
      },
      tree: {
        ...r.tree,
        [hasParent(parentid) ? parentid : TOP_LEVEL_COMMENT_PARENTID]: [
          ...(get([ "tree", hasParent(parentid) ? parentid : TOP_LEVEL_COMMENT_PARENTID ], r) || []),
          commentid
        ]
      }
    }),
    { tree: {}, comments: {} }
  ),
  (comments) => {
    comments.forEach(c => {
      commentsIds.add(c.commentid);
      parentsIds.add(c.parentid);
    });
    return comments;
  }
);
