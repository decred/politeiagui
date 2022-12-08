import { fetchProposalDetails } from "./actions";
import { records } from "@politeiagui/core/records";
import { ticketvoteSubmissions } from "@politeiagui/ticketvote/submissions";
import { piSummaries } from "../../pi/summaries";
// Services Setups
import { serviceListeners as recordsSetups } from "@politeiagui/core/records/services";
import { serviceListeners as voteSummariesSetups } from "@politeiagui/ticketvote/summaries/services";
import { serviceListeners as voteSubmissionsSetups } from "@politeiagui/ticketvote/submissions/services";
import { serviceListeners as commentsSetups } from "@politeiagui/comments/comments/services";
import { serviceListeners as commentsCountSetups } from "@politeiagui/comments/count/services";
import { serviceListeners as proposalSummariesSetups } from "../../pi/summaries/services";
import { serviceListeners as billingSetups } from "../../pi/billing/services";
// Custom effects
import {
  onCompletedOrClosedProposalFetch,
  onRecordDetailsFullToken,
  onRfpProposalFetch,
  onRfpSubmissionFetch,
  onVoteSubmissionsFetch,
} from "./customEffects";

export const recordDetailsListener = recordsSetups.details.listenTo({
  actionCreator: fetchProposalDetails,
});

export const voteSummaryListener = voteSummariesSetups.single
  .listenTo({ actionCreator: records.fetchDetails.fulfilled })
  .customizeEffect(onRecordDetailsFullToken);

export const commentsListener = commentsSetups.fetch
  .listenTo({ actionCreator: records.fetchDetails.fulfilled })
  .customizeEffect(onRecordDetailsFullToken);

export const proposalSummaryListener = proposalSummariesSetups.single
  .listenTo({ actionCreator: records.fetchDetails.fulfilled })
  .customizeEffect(onRecordDetailsFullToken);

export const proposalBillingStatusChangesListener =
  billingSetups.statusChangesSingle
    .listenTo({ actionCreator: piSummaries.fetch.fulfilled })
    .customizeEffect(onCompletedOrClosedProposalFetch);

// RFP Submissions listeners are triggered only if record has vote submissions
// and is an RFP Proposal.
export const voteSubmissionsListener = voteSubmissionsSetups.fetch
  .listenTo({ actionCreator: records.fetchDetails.fulfilled })
  .customizeEffect(onRfpProposalFetch);

export const recordsRfpSubmissionsListener = recordsSetups.batchAll
  .listenTo({ actionCreator: ticketvoteSubmissions.fetch.fulfilled })
  .customizeEffect(onVoteSubmissionsFetch);

export const voteSummariesRfpSubmissionsListener = voteSummariesSetups.all
  .listenTo({ actionCreator: ticketvoteSubmissions.fetch.fulfilled })
  .customizeEffect(onVoteSubmissionsFetch);

export const proposalsSummariesRfpSubmissionsListener =
  proposalSummariesSetups.all
    .listenTo({ actionCreator: ticketvoteSubmissions.fetch.fulfilled })
    .customizeEffect(onVoteSubmissionsFetch);

export const commentsCountsRfpSubmissionsListener = commentsCountSetups.all
  .listenTo({ actionCreator: ticketvoteSubmissions.fetch.fulfilled })
  .customizeEffect(onVoteSubmissionsFetch);

// RFP Proposals services are triggered only if record is an RFP submission.
export const recordRfpProposalListener = recordsSetups.batch
  .listenTo({ actionCreator: records.fetchDetails.fulfilled })
  .customizeEffect(onRfpSubmissionFetch);
