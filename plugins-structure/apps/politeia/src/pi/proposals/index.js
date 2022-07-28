import {
  selectProposalStatusChangesByToken,
  selectProposalsStatusChanges,
  setBillingStatusChanges,
  setRecordStatusChanges,
  setVoteStatusChanges,
} from "./proposalsSlice";

export const proposals = {
  setBillingStatusChanges,
  setRecordStatusChanges,
  setVoteStatusChanges,
  selectAllStatusChanges: selectProposalsStatusChanges,
  selectStatusChangesByToken: selectProposalStatusChangesByToken,
};
