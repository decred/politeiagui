import { records } from "@politeiagui/core/records";
import { ticketvoteSubmissions } from "@politeiagui/ticketvote/submissions";
import { piSummaries } from "../../pi/summaries";
// Services Listeners
import { serviceListeners as recordsListeners } from "@politeiagui/core/records/services";
import { serviceListeners as voteSummariesListeners } from "@politeiagui/ticketvote/summaries/services";
import { serviceListeners as voteSubmissionsListeners } from "@politeiagui/ticketvote/submissions/services";
import { serviceListeners as commentsListeners } from "@politeiagui/comments/comments/services";
import { serviceListeners as commentsCountListeners } from "@politeiagui/comments/count/services";
import { serviceListeners as proposalSummariesListeners } from "../../pi/summaries/services";
import { serviceListeners as billingListeners } from "../../pi/billing/services";
// Custom effects
import {
  onCompletedOrClosedProposalFetch,
  onRecordDetailsFullToken,
  onRfpProposalFetch,
  onRfpSubmissionFetch,
  onVoteSubmissionsFetch,
} from "./customEffects";

export const recordDetailsListener = recordsListeners.detailsOnLoad;

export const voteSummaryListener = voteSummariesListeners.single
  .listenTo({ actionCreator: records.fetchDetails.fulfilled })
  .customizeEffect(onRecordDetailsFullToken);

export const commentsListener = commentsListeners.fetch
  .listenTo({ actionCreator: records.fetchDetails.fulfilled })
  .customizeEffect(onRecordDetailsFullToken);

export const proposalSummaryListener = proposalSummariesListeners.single
  .listenTo({ actionCreator: records.fetchDetails.fulfilled })
  .customizeEffect(onRecordDetailsFullToken);

export const proposalBillingStatusChangesListener =
  billingListeners.statusChangesSingle
    .listenTo({ actionCreator: piSummaries.fetch.fulfilled })
    .customizeEffect(onCompletedOrClosedProposalFetch);

// RFP Submissions listeners are triggered only if record has vote submissions
// and is an RFP Proposal.
export const voteSubmissionsListener = voteSubmissionsListeners.fetch
  .listenTo({ actionCreator: records.fetchDetails.fulfilled })
  .customizeEffect(onRfpProposalFetch);

export const recordsRfpSubmissionsListener = recordsListeners.batchAll
  .listenTo({ actionCreator: ticketvoteSubmissions.fetch.fulfilled })
  .customizeEffect(onVoteSubmissionsFetch);

export const voteSummariesRfpSubmissionsListener = voteSummariesListeners.all
  .listenTo({ actionCreator: ticketvoteSubmissions.fetch.fulfilled })
  .customizeEffect(onVoteSubmissionsFetch);

export const proposalsSummariesRfpSubmissionsListener =
  proposalSummariesListeners.all
    .listenTo({ actionCreator: ticketvoteSubmissions.fetch.fulfilled })
    .customizeEffect(onVoteSubmissionsFetch);

export const commentsCountsRfpSubmissionsListener = commentsCountListeners.all
  .listenTo({ actionCreator: ticketvoteSubmissions.fetch.fulfilled })
  .customizeEffect(onVoteSubmissionsFetch);

// RFP Proposals services are triggered only if record is an RFP submission.
export const recordRfpProposalListener = recordsListeners.batch
  .listenTo({ actionCreator: records.fetchDetails.fulfilled })
  .customizeEffect(onRfpSubmissionFetch);
