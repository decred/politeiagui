import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const commentsByToken = get(["models", "commentsByToken"]);

export const makeGetProposalComments = token =>
  createSelector(
    commentsByToken,
    commentsByToken =>
      commentsByToken[token] ? commentsByToken[token].comments : null
  );
