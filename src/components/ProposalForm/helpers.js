export const newProposalType = {
  REGULAR_PROPOSAL: {
    label: "Regular proposal",
    value: "regular"
  },
  RFP_PROPOSAL: {
    label: "RFP proposal",
    value: "rfp"
  },
  RFP_SUBMISSIOM: {
    label: "RFP submission",
    value: "submission"
  }
};

/**
 * Return the proposal type select options.
 * @returns {Array} sortSelectOptions
 */
export const getProposalTypeOptionsForSelect = () =>
  Object.keys(newProposalType).map((key) => newProposalType[key]);
