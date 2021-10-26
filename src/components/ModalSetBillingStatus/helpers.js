import {
  PROPOSAL_BILLING_STATUS_ACTIVE,
  PROPOSAL_BILLING_STATUS_COMPLETED,
  PROPOSAL_BILLING_STATUS_CLOSED
} from "src/constants";

const billingStatusLabels = {
  [PROPOSAL_BILLING_STATUS_ACTIVE]: "Active",
  [PROPOSAL_BILLING_STATUS_COMPLETED]: "Completed",
  [PROPOSAL_BILLING_STATUS_CLOSED]: "Closed"
};

/**
 * Returns the proposal billing status select options.
 * @returns {Array}
 */
export const getProposalBillingStatusOptionsForSelect = () =>
  [
    PROPOSAL_BILLING_STATUS_ACTIVE,
    PROPOSAL_BILLING_STATUS_COMPLETED,
    PROPOSAL_BILLING_STATUS_CLOSED
  ].map((value) => ({
    label: billingStatusLabels[value],
    value
  }));
