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
import { serviceSetups as voteSummariesSetups } from "@politeiagui/ticketvote/summaries/services";
import { serviceSetups as voteInventorySetups } from "@politeiagui/ticketvote/inventory/services";
import { serviceSetups as recordsSetups } from "@politeiagui/core/records/services";
import { serviceSetups as recordsInventorySetups } from "@politeiagui/core/records/inventory/services";
import { serviceSetups as countsSetups } from "@politeiagui/comments/count/services";
import { serviceSetups as proposalsSummariesSetups } from "../summaries/services";
import { serviceSetups as proposalsBillingSetups } from "../billing/services";

// Listeners to be customized
export const recordsBatchListener = recordsSetups.batch.listenTo({
  actionCreator: fetchNextBatchRecords,
});

export const voteSummariesBatchListener = voteSummariesSetups.batch.listenTo({
  actionCreator: fetchNextBatchSummaries,
});

export const proposalsSummariesBatchListener =
  proposalsSummariesSetups.batch.listenTo({
    actionCreator: fetchNextBatchSummaries,
  });

export const proposalsBillingListener =
  proposalsBillingSetups.statusChanges.listenTo({
    actionCreator: fetchNextBatchBillingStatuses,
  });

export const commentsCountListener = countsSetups.fetch.listenTo({
  actionCreator: fetchNextBatchCount,
});

// Inventory fetch listeners
export const recordsInventoryFetchListener =
  recordsInventorySetups.fetch.listenTo({
    actionCreator: fetchInventory,
  });

export const voteInventoryFetchListener = voteInventorySetups.fetch.listenTo({
  actionCreator: fetchInventory,
});

export const rfpSubmissionsFetchListener = recordsSetups.batchAll.listenTo({
  actionCreator: records.fetch.fulfilled,
});
