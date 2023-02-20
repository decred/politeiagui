// List Actions
import {
  fetchInventory,
  fetchNextBatchBillingStatuses,
  fetchNextBatchCount,
  fetchNextBatchRecords,
  fetchNextBatchSummaries,
} from "./actions";
// Plugins Actions
import { records } from "@politeiagui/core/records";
// Using Toolkit
import { serviceListeners as voteSummariesListeners } from "@politeiagui/ticketvote/summaries/services";
import { serviceListeners as voteInventoryListeners } from "@politeiagui/ticketvote/inventory/services";
import { serviceListeners as recordsListeners } from "@politeiagui/core/records/services";
import { serviceListeners as recordsInventoryListeners } from "@politeiagui/core/records/inventory/services";
import { serviceListeners as countsListeners } from "@politeiagui/comments/count/services";
import { serviceListeners as proposalsSummariesListeners } from "../summaries/services";
import { serviceListeners as proposalsBillingListeners } from "../billing/services";

// Listeners to be customized
export const recordsBatchListener = recordsListeners.batch.listenTo({
  actionCreator: fetchNextBatchRecords,
});

export const voteSummariesBatchListener = voteSummariesListeners.batch.listenTo(
  { actionCreator: fetchNextBatchSummaries }
);

export const proposalsSummariesBatchListener =
  proposalsSummariesListeners.batch.listenTo({
    actionCreator: fetchNextBatchSummaries,
  });

export const proposalsBillingListener =
  proposalsBillingListeners.statusChanges.listenTo({
    actionCreator: fetchNextBatchBillingStatuses,
  });

export const commentsCountListener = countsListeners.fetch.listenTo({
  actionCreator: fetchNextBatchCount,
});

// Inventory fetch listeners
export const recordsInventoryFetchListener =
  recordsInventoryListeners.fetch.listenTo({
    actionCreator: fetchInventory,
  });

export const voteInventoryFetchListener = voteInventoryListeners.fetch.listenTo(
  { actionCreator: fetchInventory }
);

export const rfpSubmissionsFetchListener = recordsListeners.batchAll.listenTo({
  actionCreator: records.fetch.fulfilled,
});

export const userInventoryFetchListener =
  recordsInventoryListeners.userInventory.listenTo({
    actionCreator: fetchInventory,
  });
