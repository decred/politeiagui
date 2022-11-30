import {
  fetchBillingStatusChangesListenerCreator,
  fetchInventoryListenerCreator,
  fetchRecordsListenerCreator,
  fetchRecordsRfpSubmissionsListenerCreator,
  fetchVoteSummariesListenerCreator,
  // Records Inventory based listeners
  recordsFetchNextBatchBillingStatusesListenerCreator,
  recordsFetchNextBatchCountListenerCreator,
  recordsFetchNextBatchRecordsListenerCreator,
  recordsFetchNextBatchSummariesListenerCreator,
  // Vote Inventory based listeners
  voteFetchNextBatchBillingStatusesListenerCreator,
  voteFetchNextBatchCountListenerCreator,
  voteFetchNextBatchRecordsListenerCreator,
  voteFetchNextBatchSummariesListenerCreator,
} from "./listeners";

const setupCommonServices = [
  // Proposals Status changes
  {
    id: "pi/proposals/voteStatusChanges",
    listenerCreator: fetchVoteSummariesListenerCreator,
  },
  {
    id: "pi/proposals/recordStatusChanges",
    listenerCreator: fetchRecordsListenerCreator,
  },
  {
    id: "pi/proposals/billingStatusChanges",
    listenerCreator: fetchBillingStatusChangesListenerCreator,
  },
  // Rfp Sumbissions
  {
    id: "records/batch/all",
    listenerCreator: fetchRecordsRfpSubmissionsListenerCreator,
  },
];

export const voteInventorySetupServices = [
  ...setupCommonServices,
  {
    id: "ticketvote/inventory",
    listenerCreator: fetchInventoryListenerCreator,
  },
  {
    id: "records/batch",
    listenerCreator: voteFetchNextBatchRecordsListenerCreator,
  },
  {
    id: "ticketvote/summaries/batch",
    listenerCreator: voteFetchNextBatchSummariesListenerCreator,
  },
  {
    id: "pi/summaries/batch",
    listenerCreator: voteFetchNextBatchSummariesListenerCreator,
  },
  {
    id: "pi/billingStatusChanges",
    listenerCreator: voteFetchNextBatchBillingStatusesListenerCreator,
  },
  {
    id: "comments/count",
    listenerCreator: voteFetchNextBatchCountListenerCreator,
  },
];

export const recordsInventorySetupServices = [
  ...setupCommonServices,
  {
    id: "records/inventory",
    listenerCreator: fetchInventoryListenerCreator,
  },
  {
    id: "records/batch",
    listenerCreator: recordsFetchNextBatchRecordsListenerCreator,
  },
  {
    id: "ticketvote/summaries/batch",
    listenerCreator: recordsFetchNextBatchSummariesListenerCreator,
  },
  {
    id: "pi/summaries/batch",
    listenerCreator: recordsFetchNextBatchSummariesListenerCreator,
  },
  {
    id: "pi/billingStatusChanges",
    listenerCreator: recordsFetchNextBatchBillingStatusesListenerCreator,
  },
  {
    id: "comments/count",
    listenerCreator: recordsFetchNextBatchCountListenerCreator,
  },
];
