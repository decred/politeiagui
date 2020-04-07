import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION
} from "src/constants";
import { getCurrentDateValue } from "src/helpers";

const typesLabels = {
  [PROPOSAL_TYPE_REGULAR]: "Regular proposal",
  [PROPOSAL_TYPE_RFP]: "RFP proposal",
  [PROPOSAL_TYPE_RFP_SUBMISSION]: "RFP submission"
};

export const getRfpMinMaxDates = () => {
  const { month: currentMonth, year: currentYear } = getCurrentDateValue();
  return {
    min: { month: currentMonth, year: currentYear, day: 1 },
    max:
      currentMonth === 12
        ? { month: 1, day: 1, year: currentYear + 1 }
        : { month: currentMonth + 1, year: currentYear, day: 1 }
  };
};

/**
 * Returns the proposal type select options.
 * @returns {Array} sortSelectOptions
 */
export const getProposalTypeOptionsForSelect = () =>
  [PROPOSAL_TYPE_REGULAR, PROPOSAL_TYPE_RFP, PROPOSAL_TYPE_RFP_SUBMISSION].map(
    (value) => ({
      label: typesLabels[value],
      value
    })
  );

/**
 * Returns the proposal type select option by type enum value.
 * @param {string} value proposal type enum value
 * @returns {object} selectOption
 */
export const getProposalTypeOptionByKey = (value) => ({
  label: typesLabels[value],
  value
});
