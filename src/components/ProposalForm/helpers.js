import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION
} from "src/constants";
import { formatUnixTimestampToObj } from "src/utils";

const typesLabels = {
  [PROPOSAL_TYPE_REGULAR]: "Regular proposal",
  [PROPOSAL_TYPE_RFP]: "RFP proposal",
  [PROPOSAL_TYPE_RFP_SUBMISSION]: "RFP submission"
};

export const getRfpMinMaxDates = (minlinkby, maxlinkby) => {
  const currentTimeSec = new Date().getTime() / 1000;
  return {
    min: formatUnixTimestampToObj(currentTimeSec + +minlinkby),
    max: formatUnixTimestampToObj(currentTimeSec + +maxlinkby)
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
