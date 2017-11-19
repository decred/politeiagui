import get from "lodash/fp/get";
import { or, constant } from "../lib/fp";

export const replyTo = or(get(["app", "replyParent"]), constant(0));

export const getSubmittedProposal = (state) => {
  const submittedProposals = state.app.submittedProposals;
  return submittedProposals[submittedProposals.lastSubmitted];
};
