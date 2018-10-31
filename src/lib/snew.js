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

const getTree = ({ tree, comments }, commentid) => {
  let newTree = {};
  if (commentid) {
    const getChildren = (tree, commentid) => {
      newTree = {
        ...newTree,
        [commentid]: tree[commentid]
      };
      tree[commentid] && tree[commentid].forEach(item => getChildren(tree, item));
    };
    const getParents = (tree, commentid) => {
      const firstlevel = Object.keys(tree);
      firstlevel.forEach(key => {
        if (tree[key].find(item => item === commentid)) { // find the comment parent
          newTree = {
            ...newTree,
            [key]: [commentid]
          };
          getParents(tree, key);
        }
      });
    };
    getChildren(tree, commentid);
    getParents(tree, commentid);
    return ({ tree: newTree, comments });
  }
  return({ tree, comments });
};


export const buildCommentsTree = (comments, commentid) =>
  compose(
    (obj) => getTree(obj, commentid),
    reduce(
      (r, { commentid, userid, username, parentid, token, comment, timestamp, resultvotes, vote, censored }) => ({
        ...r,
        comments: {
          ...r.comments,
          [commentid]: {
            id: commentid,
            uservote: String(vote),
            author: username,
            authorid: userid,
            censored,
            score: resultvotes,
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
            ...(get([ "tree", parentid || TOP_LEVEL_COMMENT_PARENTID ], r) || []),
            commentid
          ]
        }
      }),
      { tree: {}, comments: {} }
    )
  )(comments);



export const commentsToT1 = (comments, commentid) => {
  return compose(
    getChildComments,
    comments => buildCommentsTree(comments, commentid)
  )(comments);
};
