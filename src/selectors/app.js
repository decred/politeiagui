import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import eq from "lodash/fp/eq";
import filter from "lodash/fp/filter";
import find from "lodash/fp/find";
import { or, constant, not } from "../lib/fp";
import { proposal as apiProposal } from "./api";

export const replyTo = or(get(["app", "replyParent"]), constant(0));

export const proposal = or(apiProposal, (state) => {
  const submittedProposals = state.app.submittedProposals;
  return submittedProposals[submittedProposals.lastSubmitted];
}, constant({}));

export const isMarkdown = compose(eq("index.md"), get("name"));
export const getProposalFiles = compose(get("files"), proposal);
export const getMarkdownFile = compose(find((isMarkdown)), getProposalFiles);
export const getNotMarkdownFile = compose(filter(not(isMarkdown)), getProposalFiles);
