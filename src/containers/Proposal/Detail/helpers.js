import { isAbandonedProposal, isVotingFinishedProposal } from "../helpers";
import uniq from "lodash/uniq";

export const getCommentBlockedReason = (proposal, voteSummary) => {
  if (isAbandonedProposal(proposal)) {
    return "This proposal has been abandoned. New comments and comment votes are not allowed.";
  }

  if (isVotingFinishedProposal(voteSummary)) {
    return "Voting has finished for this proposal. New comments and comment votes are not allowed.";
  }

  return "";
};

export const getDetailsFile = (files = []) =>
  files.find((f) => f.name === "index.md");

export const calculateAuthorUpdateTree = (authorUpdateId, comments) => {
  let authorUpdateTree = [authorUpdateId];
  let children = comments
    .filter(({ parentid }) => authorUpdateTree.includes(parentid))
    .map(({ commentid }) => commentid);
  while (
    uniq([...authorUpdateTree, ...children]).length > authorUpdateTree.length
  ) {
    authorUpdateTree = uniq([...authorUpdateTree, ...children]);
    const parents = [...authorUpdateTree];
    children = comments
      .filter(({ parentid }) => parents.includes(parentid))
      .map(({ commentid }) => commentid);
  }
  return uniq([...authorUpdateTree, ...children]);
};
