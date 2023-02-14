import {
  commentsCountListener,
  proposalsBillingListener,
  proposalsSummariesBatchListener,
  recordsBatchListener,
  recordsInventoryFetchListener,
  rfpSubmissionsFetchListener,
  userInventoryFetchListener,
  voteInventoryFetchListener,
  voteSummariesBatchListener,
} from "./servicesListeners";
import {
  billingStatusChangesListener,
  recordsStatusChangesListener,
  voteStatusChangesListener,
} from "../proposals/servicesListeners";
import {
  onRecordsInventoryFetch,
  onRfpSubmissionFetch,
  onUserInventoryFetch,
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

export const servicesSetupsByUserInventory = [
  ...commonSetups,
  userInventoryFetchListener,
  // Customize listeners effects for user inventory fetch
  voteSummariesBatchListener.customizeEffect(onUserInventoryFetch),
  recordsBatchListener.customizeEffect(onUserInventoryFetch),
  proposalsSummariesBatchListener.customizeEffect(onUserInventoryFetch),
  proposalsBillingListener.customizeEffect(onUserInventoryFetch),
  commentsCountListener.customizeEffect(onUserInventoryFetch),
];
