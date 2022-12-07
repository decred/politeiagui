import {
  billingStatusChangesListener,
  commentsCountListener,
  proposalsBillingListener,
  proposalsSummariesBatchListener,
  recordsBatchListener,
  recordsInventoryFetchListener,
  recordsStatusChangesListener,
  rfpSubmissionsFetchListener,
  voteInventoryFetchListener,
  voteStatusChangesListener,
  voteSummariesBatchListener,
} from "./servicesListeners";
import {
  onRecordsInventoryFetch,
  onRfpSubmissionFetch,
  onVoteInventoryFetch,
} from "./customEffects";

const commonSetups = [
  // Use default service effect
  voteStatusChangesListener,
  recordsStatusChangesListener,
  billingStatusChangesListener,
  // With custom effects
  rfpSubmissionsFetchListener.customizeEffect(onRfpSubmissionFetch),
];

export const servicesSetupsByVoteInventory = [
  ...commonSetups,
  voteInventoryFetchListener,
  // Customize listeners effects for vote inventory fetch
  voteSummariesBatchListener.customizeEffect(onVoteInventoryFetch),
  recordsBatchListener.customizeEffect(onVoteInventoryFetch),
  proposalsSummariesBatchListener.customizeEffect(onVoteInventoryFetch),
  proposalsBillingListener.customizeEffect(onVoteInventoryFetch),
  commentsCountListener.customizeEffect(onVoteInventoryFetch),
];

export const servicesSetupsByRecordsInventory = [
  ...commonSetups,
  recordsInventoryFetchListener,
  // Customize listeners effects for records inventory fetch
  voteSummariesBatchListener.customizeEffect(onRecordsInventoryFetch),
  recordsBatchListener.customizeEffect(onRecordsInventoryFetch),
  proposalsSummariesBatchListener.customizeEffect(onRecordsInventoryFetch),
  proposalsBillingListener.customizeEffect(onRecordsInventoryFetch),
  commentsCountListener.customizeEffect(onRecordsInventoryFetch),
];
