import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { piBilling } from "../billing";
import { piSummaries } from "../summaries";
import {
  convertBillingStatusToProposalStatus,
  convertRecordStatusToProposalStatus,
  convertVoteStatusToProposalStatus,
  getRecordStatusChangesMetadata,
} from "./utils";

export function selectProposalStatusChangesByToken(state, token) {
  // Get Record and its Proposal Summary
  const record = records.selectByToken(state, token);
  const piSummary = piSummaries.selectByToken(state, token);
  if (!record || !piSummary) return;
  // Status changes
  // TODO: create a core/records selector for record status changes
  const recordStatusChanges = getRecordStatusChangesMetadata(record);
  const billingStatusChanges = piBilling.selectByToken(state, token) || [];
  const voteStatusChanges =
    ticketvoteSummaries.selectStatusChangesByToken(state, token) || [];

  // convert status from status change to pi-summary
  const proposalVoteStatusChanges = voteStatusChanges.map(
    ({ status, ...rest }) => ({
      ...rest,
      status: convertVoteStatusToProposalStatus(status, record.status),
    })
  );
  const proposalRecordStatusChanges = recordStatusChanges.map(
    ({ status, ...rest }) => ({
      ...rest,
      status: convertRecordStatusToProposalStatus(status, record.state),
    })
  );
  const proposalBillingStatusChanges = billingStatusChanges.map(
    ({ status, ...rest }) => ({
      ...rest,
      status: convertBillingStatusToProposalStatus(status),
    })
  );

  // Order by most recent status change
  const statusChangesOrdered = [
    ...proposalBillingStatusChanges,
    ...proposalRecordStatusChanges,
    ...proposalVoteStatusChanges,
  ].sort((a, b) => b.timestamp - a.timestamp);

  return statusChangesOrdered;
}
