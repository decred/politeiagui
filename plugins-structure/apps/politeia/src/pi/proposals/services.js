import {
  setProposalsBillingStatusChangesEffect,
  setProposalsRecordsStatusChangesEffect,
  setProposalsVoteStatusChangesEffect,
} from "./effects";

export const services = [
  {
    id: "pi/proposals/voteStatusChanges",
    effect: setProposalsVoteStatusChangesEffect,
  },
  {
    id: "pi/proposals/recordStatusChanges",
    effect: setProposalsRecordsStatusChangesEffect,
  },
  {
    id: "pi/proposals/billingStatusChanges",
    effect: setProposalsBillingStatusChangesEffect,
  },
];
