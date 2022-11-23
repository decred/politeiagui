import { createSliceServices } from "@politeiagui/core/toolkit";
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

export const sliceServices = createSliceServices({
  name: "piProposals",
  services: {
    voteStatusChanges: { effect: setProposalsVoteStatusChangesEffect },
    recordStatusChanges: { effect: setProposalsRecordsStatusChangesEffect },
    billingStatusChanges: { effect: setProposalsBillingStatusChangesEffect },
  },
});
