// List Actions
import {
  fetchInventory,
  fetchNextBatchRecords,
  fetchNextBatchSummaries,
} from "./actions";
// Plugins Actions
import { records } from "@politeiagui/core/records";
// Custom Effects
import { onRfpSubmissionFetch, onVoteInventoryFetch } from "./customEffects";
// Using Toolkit
import { serviceSetups as voteSummariesSetups } from "@politeiagui/ticketvote/summaries/services";
import { serviceSetups as voteInventorySetups } from "@politeiagui/ticketvote/inventory/services";
import { serviceSetups as recordsSetups } from "@politeiagui/core/records/services";

const voteInventoryFetchSetup = voteInventorySetups.fetch.listenTo({
  actionCreator: fetchInventory,
});

const voteSummariesBatchSetup = voteSummariesSetups.batch
  .listenTo({ actionCreator: fetchNextBatchSummaries })
  .customizeEffect(onVoteInventoryFetch);

const recordsBatchSetup = recordsSetups.batch
  .listenTo({ actionCreator: fetchNextBatchRecords })
  .customizeEffect(onVoteInventoryFetch);

const recordsBatchAllSetup = recordsSetups.batchAll
  .listenTo({
    actionCreator: records.fetch.fulfilled,
  })
  .customizeEffect(onRfpSubmissionFetch);

const commonServicesSetups = [recordsBatchAllSetup];

export const servicesByVoteInventory = [
  ...commonServicesSetups,
  voteInventoryFetchSetup,
  voteSummariesBatchSetup,
  recordsBatchSetup,
];
