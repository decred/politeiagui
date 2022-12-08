import { createSliceServices } from "@politeiagui/core/toolkit";
import {
  setProposalsBillingStatusChangesEffect,
  setProposalsRecordsStatusChangesEffect,
  setProposalsVoteStatusChangesEffect,
} from "./effects";

export const { pluginServices, serviceSetups } = createSliceServices({
  name: "piProposals",
  services: {
    voteStatusChanges: { effect: setProposalsVoteStatusChangesEffect },
    recordStatusChanges: { effect: setProposalsRecordsStatusChangesEffect },
    billingStatusChanges: { effect: setProposalsBillingStatusChangesEffect },
  },
});
