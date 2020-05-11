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

/**
 * Returns the available dates range as objects { min,max } for RFP linkby
 * using policy provided values
 * @param {number} minlinkbyperiod min possible linkby period as seconds unix
 * @param {number} maxlinkbyperiod max possible linkby period as seconds unix
 */
export const getRfpMinMaxDates = (minlinkbyperiod, maxlinkbyperiod) => {
  const currentTimeSec = new Date().getTime() / 1000;
  return {
    min: formatUnixTimestampToObj(currentTimeSec + Number(minlinkbyperiod)),
    max: formatUnixTimestampToObj(currentTimeSec + Number(maxlinkbyperiod))
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
